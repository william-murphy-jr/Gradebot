const fetch = require('node-fetch')
const querystring = require('querystring')
const nodeurl = require('url')
const fs = require('fs')

// put canvas admin api key in here
// (created on site admin under /profile)
const config = require('./config')

function parselinks (resp) {
  // parse pagination link header
  const links = resp.headers.get('link')
  const linkdata = {}
  if (links) {
    for (let s of links.split(',')) {
      var [url, type] = s.match('<(.*)>; rel="(.*)"')
      linkdata[type] = url
    }
    if (linkdata.next) {
      var nexturi = linkdata.next
    }
  }
  return linkdata
}

async function req (url, method = 'get', params = null) {
  // make a canvas API request. automatically does pagination to grab all entries.
  const headers = {'Authorization': `Bearer ${config.canvas_api_token}`}
  var body = null
  if (params) {
    body = querystring.stringify(params)
    headers['content-type'] = 'application/x-www-form-urlencoded'
  }
  const uri = `${config.canvas_base}/api/v1${url}`
  const opts = {headers, method, body}
  console.log(method, uri, params)

  var resp = await fetch(uri, opts)
  var links = parselinks(resp)
  const results = [await resp.json()]
  while (links.next) {
    console.log('paginate next', links.next)
    resp = await fetch(links.next, opts)
    results.push(await resp.json())
    links = parselinks(resp)
  }

  if (results.length == 1) {
    if ([200, 201].includes(resp.status)) {
      console.log(`API resp ${url}`, results[0])
      return results[0]
    } else {
      console.warn('non 200 resp', resp)
    }
  } else {
    var flat = []
    for (let result of results) {
      flat = flat.concat(result)
    }
    console.log(`API resp ${url}`, flat)
    return flat
  }
}

async function create_or_get_assignment_group (cid, name) {
  const groups = await req(`/courses/${cid}/assignment_groups`)
  for (var g of groups) {
    if (g.name === name) {
      return g
    }
  }
  return await create_assignment_group(cid, name)
}

async function create_or_get_course (name) {
  var courses = await req('/accounts/1/courses')
  for (var course of courses) {
    if (course.name == name) {
      return course
    }
  }
  return await create_course(name)
}

function create_course (name) {
  var params = {
    'course[name]': name,
    'course[is_public]': true
  }
  return req('/accounts/1/courses', 'post', params)
}

function create_module (course_id, name) {
  var params = {
    'module[name]': name
  }
  return req(`/courses/${course_id}/modules`, 'post', params)
}

function create_module_item (cid, mid, name, url) {
  const params = {
    'module_item[title]': name,
    'module_item[new_tab]': false,
    'module_item[type]': 'ExternalUrl',
    'module_item[external_url]': url
  }
  return req(`/courses/${cid}/modules/${mid}/items`, 'post', params)
}

function create_assignment_group (cid, name) {
  const params = {
    'name': name
  }
  return req(`/courses/${cid}/assignment_groups`, 'post', params)
}

async function delete_courses (name) {
  var courses = await req('/accounts/1/courses')
  for (var course of courses) {
    if (course.name == name) {
      console.log('delete course', course.id)
      await req(`/courses/${course.id}`, 'delete', {'event': 'delete'})
    }
  }
}

async function delete_assignments (cid, group_name) {
  const assignments = await req(`/courses/${cid}/assignments`)
  const a_groups = await req(`/courses/${cid}/assignment_groups`)
  var group
  for (let g of a_groups) {
    if (g.name == group_name) {
      group = g
      break
    }
  }

  if (group) {
    for (let assignment of assignments) {
      if (assignment.assignment_group_id == group.id) {
        console.log('deleting', assignment)
        await req(`/courses/${cid}/assignments/${assignment.id}`, 'delete')
      }
    }
  }
}

function create_lti_assignment (cid, id, name, group_id) {
  const params = {
    'assignment[name]': name,
    'assignment[submission_types][]': 'external_tool',
    'assignment[points_possible]': 5,
    'assignment[published]': true,
    'assignment[external_tool_tag_attributes][url]': `${config.lti_root}/lti?assignmentid=${id}`
  }
  if (group_id) { params['assignment[assignment_group_id]'] = group_id }

  return req(`/courses/${cid}/assignments`, 'post', params)
}

function read_fcc_json (filename) {
  filename = filename || 'basic-javascript.json'
  const fcc_includes = [ `freecodecamp/seed/challenges/02-javascript-algorithms-and-data-structures/${filename}` ]
  const fcc_data = JSON.parse(fs.readFileSync(fcc_includes[0]))
  const fcc_index = {}
  for (let challenge of fcc_data.challenges) {
    fcc_index[challenge.id] = challenge
  }
  return {fcc_index, fcc_data}
}

async function create_fcc_assignments (coursename) {
  const course = await create_or_get_course(coursename)
  const group = await create_or_get_assignment_group(course.id, 'Javascript Challenges')
  const assignments = await req(`/courses/${course.id}/assignments`)
  const fcc_info = read_fcc_json()

  const existing_assignments_index = {}

  for (let assignment of assignments) {
    let lti_url = assignment.external_tool_tag_attributes && assignment.external_tool_tag_attributes.url
    if (lti_url) {
      var u = new nodeurl.URL(lti_url)
      var params = new nodeurl.URLSearchParams(u.search)
      var assignment_id = params.get('assignmentid')
      if (assignment_id) {
        existing_assignments_index[assignment_id] = assignment
      }
    }
  }

  for (let challenge of fcc_info.fcc_data.challenges) {
    if (existing_assignments_index[challenge.id]) {
      console.log('assignment already created!', challenge)
    } else {
      // must create this assignment ! (and order it correctly ?)
      var assignment = await create_lti_assignment(course.id, challenge.id, challenge.title, group.id)
    }
  }
}

async function go () {
  // const course = await create_or_get_course('GreatTestCourse8')
  const course = await create_or_get_course('KyleTestCourse')
  const modules = await req(`/courses/${course.id}/modules`)
  const assignments = await req(`/courses/${course.id}/assignments`)
  const a_groups = await req(`/courses/${course.id}/assignment_groups`)

  const testnum = 20

  for (var i = 1; i <= testnum; i++) {
    if (modules.length < testnum) {
      var module = await create_module(course.id, `Week ${i}`)
      await create_module_item(course.id, module.id, `Syllabus`, `https://gradebot.tlmworks.org/gitlab/CourseContent/Track1/Week${i}`)
    }

    if (assignments.length < testnum) {
      var assignment = await create_lti_assignment(course.id, i, `test assignment ${i}`)
    }
  }
}

function export_top_level_functions () {
  const esprima = require('esprima')
  const program = fs.readFileSync(__filename, 'utf8')
  const parsed = esprima.parseScript(program)
  for (let fn of parsed.body) {
    if (fn.type.endsWith('FunctionDeclaration')) {
      module.exports[fn.id.name] = eval(fn.id.name)
    }
  }
}

export_top_level_functions()

// go()
// to get REPL + chrome inspector run this
// node --inspect -i -e "$(<canvas-api.js)"
