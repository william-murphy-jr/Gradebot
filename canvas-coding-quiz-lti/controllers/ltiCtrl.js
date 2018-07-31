const lti = require('ims-lti')
const vm = require('vm')
const chai = require('chai')
const expect = require('chai').expect
const assert = chai.assert
const jsdom = require('jsdom')
const { JSDOM } = jsdom
const fs =require('fs')
const path = require('path')
const cheapsession = {}
const { getChallenges } = require('@freecodecamp/curriculum')
const fcc = load_freecodecamp_challenges()
const config = require('../config')


//Helper Functions
function getAssignment(id) {
  if (fcc.fcc_index[id]) {
    const challenge = fcc.fcc_index[id]
    console.log('found FCC challenge',challenge)
    return challenge
  }
  console.error(`unable to find assignment with id ${id}`)
}

function load_freecodecamp_challenges() {
  const fcc_index = {}
  getChallenges().forEach(c => {
    // const fcc_data = JSON.parse(c)   
    for (let challenge of c.challenges) {
      fcc_index[challenge.id] = challenge
    }
  })
  return {fcc_index}
}

let codeEval = (req, res, next) => {
  const data = req.body;
  const tests = data.tests
  const evalOfTests = []
  const code = data.code
  const { window } = new JSDOM(`<html><body>${code}</body></html>`).window
  const $ = require('jquery')(window)
  const document = window.document
  const sandbox = { assert, expect, chai, document, $, code};
  vm.createContext(sandbox);
  tests.forEach((test, index) => {
    const newCode = (data.code.includes('let') && index === 0) ?  data.code : !data.code.includes('let') ? data.code : ""
    let fullTest = `${data.head} \n  \n ${newCode}; \n ${data.tail} \n ${test.testString} `
    try {
      vm.runInContext(fullTest, sandbox, {timeout: 1000});
      evalOfTests.push(true)
    } catch (e) {
      console.log(e)
      evalOfTests.push(false)
    }
   })
  return evalOfTests;
}

async function post(req, res) {
  /* TODO - fetch user's previous submission */
  const provider = new lti.Provider( config.consumer_key,  config.consumer_secret )
  provider.valid_request(req, async (err, isValid) => {
    if (err) {
      console.error('invalid request',err)
      res.send(err + ". check your consumer key and consumer secret (and nginx https proxy header)")
    } else {
      console.log('provider good',provider)
      const assignmentId = req.query.assignmentid
      let assignmnet;
      // if external tool is an assignment, then it will have outcome_service_url
      if (assignmentId) {
        assignment = getAssignment(req.query.assignmentid)
      }
      const id = Math.floor(Math.random() * 1000000).toString()
      assignment.nextAssignment = {courseId: provider.body.custom_canvas_course_id, assignmentId: + provider.body.custom_canvas_assignment_id + 1}
      assignment.syntax = req.query.syntax || "javascript"
      cheapsession[id] = {provider, assignment}
      return res.redirect(`/lti/${assignmentId}/${id}/`)
    }
  })
}

function submit(req, res) {
  const sessid = req.params.sessionId
  const data = cheapsession[sessid]
  if (data) {
    console.log('found session',data)
    // const origbody = data.req.body
    // use these two to check if the student already made a submission
    // get single user's submission:
    // https://canvas.instructure.com/doc/api/submissions.html#method.submissions_api.show
    // const canvas_assignment_id = origbody.custom_canvas_assignment_id
    // const canvas_course_id = origbody.custom_canvas_course_id
    const assignment_id = req.body.custom_canvas_assignment_id
    const course_id = req.body.custom_canvas_course_id
    const user_id = req.body.custom_canvas_user_id
    const provider = cheapsession[sessid].provider
    const assignment = data.assignment
    const code = req.body.code
    const correct = true
    // req.body.state &&
    //     req.body.state.checked &&
    //     req.body.state.checked.result &&
    //     req.body.state.checked.result.passed
    if (!provider.outcome_service) {
      res.send({error:'you must be a student to submit'})
      return
    }
    // function cb(err, result) { 
      // console.log('grade submission result',err,result)
      // return
      // redirect them to there grade
    // }
    // console.log('user submitting grade correct:',correct)
    if (correct) {
      console.log("this is correct")
      provider.outcome_service.send_replace_result_with_text( 1, code, (err, result) => {
        return res.send({ message: result  })
      } )
    } else {
      res.send({error:'incorrect solution.'})
      provider.outcome_service.send_replace_result_with_text( 0, code, (err, result) => {
        return res.send({ message: result })
      })
    }
    
  } else {
    res.send({error:'session not found. try reloading'})
  }
}

function get (req,res) {
  res.sendFile(path.resolve(`${__dirname}/../client/build/index.html`))
}

function getState(req, res) {
  const assignment = getAssignment("56533eb9ac21ba0edf2244aa")
  // const assignment = cheapsession[req.params.sessionId].assignment
  res.send({assignment, sessionId: req.params.sessionId})
}

function check(req, res) {
  const resultsArr = codeEval(req,res)
  res.send(resultsArr)
}

module.exports = {
  submit,
  get,
  post,
  getAssignment,
  getState,
  check
}

