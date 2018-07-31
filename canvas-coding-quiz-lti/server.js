const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const lti = require('ims-lti')
const fs = require('fs')
const canvas = require('./canvas-api')
const config = require('./config')
const path = require('path')

const cheapsession = {}
const fcc = load_freecodecamp_challenges()

function load_freecodecamp_challenges() {
  const fcc_includes = [ 'freecodecamp/seed/challenges/02-javascript-algorithms-and-data-structures/basic-javascript.json' ]
  const fcc_data = JSON.parse(fs.readFileSync(fcc_includes[0]))
  const fcc_index = {}
  for (let challenge of fcc_data.challenges) {
    fcc_index[challenge.id] = challenge
  }
  return {fcc_data, fcc_index}
}

function getAssignment(id) {
  if (fcc.fcc_index[id]) {
    var challenge = fcc.fcc_index[id]
    console.log('found FCC challenge',challenge)
    return challenge
  }
  console.error(`unable to find assignment with id ${id}`)
}

app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.urlencoded());
app.enable('trust proxy') // this lets req.proto == 'https'

app.get('/api', (req, res) => {
  res.json({message: "api root."})
})

app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
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
})

app.get('/lti', async (req, res) => {
  res.send(app.locals.tdata)
})

app.post('/lti', async (req, res) => {
    /* TODO - fetch user's previous submission */
    console.log('/lti')
  
  const provider = new lti.Provider( config.consumer_key,  config.consumer_secret )
  // console.log('lti launch params',req.body)
  provider.valid_request(req, async (err, isValid) => {
    if (err) {
      console.error('invalid request',err)
      res.send(err + ". check your consumer key and consumer secret (and nginx https proxy header)")
    } else {

      const assignment_id = req.body.custom_canvas_assignment_id
      const course_id = req.body.custom_canvas_course_id
      const user_id = req.body.user_id
      
      const submitted = await canvas.req(`/courses/${course_id}/assignments/${assignment_id}/submissions/${user_id}`)
      const assignments_link = `/courses/${course_id}/assignments`
      
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
        initstate: {
          body:req.body,
          assignment:assignment,
          session: sessid,
          submitted: submitted,
          assignments_link: assignments_link
        }
      }
      if (false) { // debug
        initstate.provider = provider
      }
      // console.log(tdata.initstate.assignment.solution)
      app.locals.tdata = tdata
      res.sendFile(path.join(__dirname, 'build', 'index.html'));

      // ejs.renderFile('views/lti.ejs', tdata, null, (err,str) => {
      //   if (err) {
      //     console.error(err)
      //     res.send('Internal Server Error',500)
      //   } else {
      //     console.log("this is the str", str)
      //     res.send(str)
      //   }
      // })
    }
  })
})



const port = 3030
app.listen(port, function () {
  console.log(`ltitool on ${port}`)
})

// for debugging
global.canvas = canvas
