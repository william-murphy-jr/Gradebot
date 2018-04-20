const vm = require('vm')
const expect = require('chai').expect
const chai = require('chai')
const config = require('../config')
const fs =require('fs')
const path = require('path')
const cheapsession = {}
const fcc = load_freecodecamp_challenges()
const assert = require('assert')

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

function getAssignment(id) {
  if (fcc.fcc_index[id]) {
    const challenge = fcc.fcc_index[id]
    // console.log('found FCC challenge',challenge)
    return challenge
  }
  console.error(`unable to find assignment with id ${id}`)
}

function load_freecodecamp_challenges() {
  const fcc_includes = [ 'freeCodeCamp/seed/challenges/02-javascript-algorithms-and-data-structures/basic-javascript.json', 'freeCodeCamp/seed/challenges/08-coding-interview-questions-and-take-home-assignments/project-euler-problems.json' ]
  const fcc_index = {}
  fcc_includes.forEach(c => {
    const fcc_data = JSON.parse(fs.readFileSync(c))   
    for (let challenge of fcc_data.challenges) {
      fcc_index[challenge.id] = challenge
    }
  })
  return {fcc_index}
}

function get(req, res) {
  req.session.assignment = req.session.assignment || getAssignment('5900f3881000cf542c50fe9b')
  console.log("this is it::::::",req.query)
  res.send({assignment : req.session.assignment, sessionId: req.session.sessionId })
}

function check(req, res) {
  const resultsArr = codeEval(req,res)
  res.send(resultsArr)
}

module.exports ={
  get,
  check
}