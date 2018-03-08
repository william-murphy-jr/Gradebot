const lti = require('ims-lti'),
      config = require('../config'),
      fs =require('fs'),
      path = require('path')
      cheapsession = {}
      fcc = load_freecodecamp_challenges()

//Helper Functions

function getAssignment(id) {
  if (fcc.fcc_index[id]) {
    const challenge = fcc.fcc_index[id]
    // console.log('found FCC challenge',challenge)
    return challenge
  }
  console.error(`unable to find assignment with id ${id}`)
}

function load_freecodecamp_challenges() {
  const fcc_includes = [ 'freeCodeCamp/seed/challenges/02-javascript-algorithms-and-data-structures/basic-javascript.json' ],
        fcc_data = JSON.parse(fs.readFileSync(fcc_includes[0])),
        fcc_index = {}
  for (let challenge of fcc_data.challenges) {
    fcc_index[challenge.id] = challenge
  }
  return {fcc_data, fcc_index}
}

function post(req, res) {
  /* TODO - fetch user's previous submission */
  const provider = new lti.Provider( config.consumer_key,  config.consumer_secret )
  // console.log('lti launch params',req.body)
  // console.log(provider.valid_request)
  provider.valid_request(req, async (err, isValid) => {
    if (err) {
      console.error('invalid request',err)
      res.send(err + ". check your consumer key and consumer secret (and nginx https proxy header)")
    } else {
      const assignment_id = req.body.custom_canvas_assignment_id || req.body.assignmentid,
            course_id = req.body.custom_canvas_course_id,
            user_id = req.body.user_id,
            submitted = await canvas.req(`/courses/${course_id}/assignments/${assignment_id}/submissions/${user_id}`),
            assignments_link = `/courses/${course_id}/assignments`
      let assignmnet;
      // console.log('provider good',provider)
      // if external tool is an assignment, then it will have outcome_service_url
      if (req.query.assignmentid) {
        assignment = getAssignment(req.query.assignmentid)
      }
      const sessid = Math.floor(Math.random() * 1000000).toString()
      cheapsession[sessid] = {req, provider, assignment}
      req.session.assignment = assignment
      return res.redirect(`/lti/${assignment_id}/${sessid}`)
    }
  })
}

async function submit(req, res) {
  // console.log('submit solution params',req.body)
  const sessid = req.body.session
  const data = cheapsession[sessid]

  if (data) {
    console.log('found session',data)
    const origbody = data.req.body
    // use these two to check if the student already made a submission
    // get single user's submission:
    // https://canvas.instructure.com/doc/api/submissions.html#method.submissions_api.show
    const canvas_assignment_id = origbody.custom_canvas_assignment_id
    const canvas_course_id = origbody.custom_canvas_course_id
    const provider = data.provider
    const assignment = data.assignment
    const code = req.body.code
    const correct = req.body.state &&
        req.body.state.checked &&
        req.body.state.checked.result &&
        req.body.state.checked.result.passed

    if (!provider.outcome_service) {
      res.send({error:'you must be a student to submit'})
      return
    }
    function cb(err, result) {
      console.log('grade submission result',err,result)
      res.send({error:err,success:result})
    }
    console.log('user submitting grade correct:',correct)
    if (correct) {
      provider.outcome_service.send_replace_result_with_text( 1, code, cb )
    } else {
      res.send({error:'incorrect solution.'})
      //provider.outcome_service.send_replace_result_with_text( 0, code, cb )
    }
    
  } else {
    res.send({error:'session not found. try reloading'})
  }
}

function get (req,res) {
  res.sendFile(path.join( __dirname, '../build', 'index.html'));
}

module.exports = {
  submit,
  get,
  post
}

