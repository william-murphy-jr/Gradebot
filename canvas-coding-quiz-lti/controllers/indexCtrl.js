const vm = require('vm')
const expect = require('chai').expect
const chai = require('chai')
const config = require('../config')
const fs =require('fs')
const path = require('path')
const assert = require('assert')
const fcc = load_freecodecamp_challenges()

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
  const fcc_includes = [ 'freeCodeCamp/seed/challenges/02-javascript-algorithms-and-data-structures/basic-javascript.json']
  const fcc_index = {}
  fcc_includes.forEach(c => {
    const fcc_data = JSON.parse(fs.readFileSync(c))   
    for (let challenge of fcc_data.challenges) {
      fcc_index[challenge.id] = challenge
    }
  })
  return {fcc_index}
}

// Helper Functions
let codeEval = (req, res, next) => {
  const data = req.body;
  const code = data.code;
  const tests = data.tests
  const evalOfTests = []
  const sandbox = { assert, expect, chai, code };
  vm.createContext(sandbox);
  tests.forEach(test => {
    let fullTest = `${data.head} \n ;\n;${code};\n \n ${data.tail} \n ${test} `
    try {
      vm.runInContext(fullTest, sandbox);
      evalOfTests.push(true)
    } catch (e) {
      evalOfTests.push(false)
    }
   })
  return evalOfTests;
}

function get(req, res) {
  const assignment = getAssignment('587d7b7e367417b2b2512b21')
  // console.log(assignment)
  console.log("this is the query", req.query)
  res.send({assignment: req.session.assignment || assignment, sessionId: req.session.sessionId })
}

function check(req, res) {
  const resultsArr = codeEval(req,res)
  res.send(resultsArr)
}

module.exports ={
  get,
  check
}