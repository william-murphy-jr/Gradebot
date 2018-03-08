const vm = require('vm'),
      assert = require('assert'),
      expect = require('chai').expect,
      chai = require('chai');

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
  res.send(req.session.assignment)
}

function check(req, res) {
  const resultsArr = codeEval(req,res)
  res.send(resultsArr)
}

module.exports ={
  get,
  check
}