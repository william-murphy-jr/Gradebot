const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const lti = require('ims-lti')
const ejs = require('ejs')
const fetch = require('node-fetch')
const Remarkable = require('remarkable')
const ropts = {typographer: true,html:true,linkify:true,linkTarget:"_blank"}
const md = new Remarkable(ropts)
const fs = require('fs')

const cheapsession = {}

const fcc_includes = [ 'seed/challenges/02-javascript-algorithms-and-data-structures/basic-javascript.json' ]
const fcc_data = JSON.parse(fs.readFileSync(fcc_includes[0]))
const fcc_index = {}
for (let challenge of fcc_data.challenges) {
  fcc_index[challenge.id] = challenge
}


function getAssignment(id) {
  if (fcc_index[id]) {
    var challenge = fcc_index[id]
    console.log('found FCC challenge',challenge)
    return challenge
  }
}

app.use(express.static('public'))
app.use(bodyParser.urlencoded());
app.enable('trust proxy') // this lets req.proto == 'https'


async function testCanvasAPI() {
  const headers = {'Authorization':`Bearer ${config.canvas_api_token}`}
  const result = await fetch(`${config.canvas_base}/api/v1/courses`, {headers})
  const j = await result.json()
  console.log('API /courses',j)
}

app.get('/gitlab/:org/:repo/:page', async (req, res) => {
  const url = `https://gitlab.tlmworks.org/${req.params.org}/${req.params.repo}/wikis/${req.params.page}.md`
  console.log('get url',url)
  const resp = await fetch(url)
  const text = await resp.text()
  const html = md.render(text)
  res.send(html)
})

app.post('/lti-grade', bodyParser.json(), async (req, res) => {
  console.log('submit solution params',req.body)
  var sessid = req.body.session
  var data = cheapsession[sessid]

  
  if (data) {
    console.log('found session',data)
    var origbody = data.req.body
    // use these two to check if the student already made a submission
    // get single user's submission:
    // https://canvas.instructure.com/doc/api/submissions.html#method.submissions_api.show
    var canvas_assignment_id = origbody.custom_canvas_assignment_id
    var canvas_course_id = origbody.custom_canvas_course_id
    var provider = data.provider
    var assignment = data.assignment
    var code = req.body.code
    var correct = req.body.state &&
        req.body.state.submission &&
        req.body.state.submission.result &&
        req.body.state.submission.result.passed

    if (!provider.outcome_service) {
      res.send({error:'must be a student'})
      return
    }
    console.log('collected vars')
    if (correct) {
      function cb(err, result) {
        console.log('grade submission result',err,result)
        res.send({error:err,success:result})
      }
      provider.outcome_service.send_replace_result_with_text( 1, code, cb )
    } else {
      provider.outcome_service.send_replace_result_with_text( 0, code, cb )
    }
    
  } else {
    res.send({error:'session not found. try reloading'})
  }
})

app.post('/lti', async (req, res) => {
    /* TODO - fetch user's previous submission */
  
  const provider = new lti.Provider( config.consumer_key,
                                     config.consumer_secret )
  console.log('lti launch params',req.body)
  provider.valid_request(req, (err, isValid) => {
    if (err) {
      console.error('invalid request',err)
      res.send(err + ". check your consumer key and consumer secret.")
    } else {
      console.log('provider good',provider)
      // if external tool is an assignment, then it will have outcome_service_url
      var assignment
      if (req.query.assignmentid) {
        // fetch the assignment id information
        assignment = getAssignment(req.query.assignmentid)
      }
      var sessid = Math.floor(Math.random() * 1000000).toString()
      cheapsession[sessid] = {req, provider, assignment}
      const tdata = {
        body:req.body,
        assignment:assignment,
        provider:provider,
        session: sessid
      }
      ejs.renderFile('views/lti.html', tdata, null, (err,str) => {
        res.send(str)
      })
    }
  })
})
const port = 3030
app.listen(port, function () {
  console.log(`ltitool on ${port}`)
})
