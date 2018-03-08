const express = require('express'),
      router = express.Router(),


      indexCtrl = require('../controllers/indexCtrl.js')

router.get('/get-state', indexCtrl.get)

// evaluation of code with challenges and testing
// let codeEval = (req, res, next) => {
//   const data = req.body;
//   const code = data.code;
//   const tests = data.tests
//   const evalOfTests = []
//   const sandbox = { assert, expect, chai, code };
//   vm.createContext(sandbox);
//   tests.forEach(test => {
//     let fullTest = `${data.head} \n ;\n;${code};\n \n ${data.tail} \n ${test} `
//     try {
//       vm.runInContext(fullTest, sandbox);
//       evalOfTests.push(true)
//     } catch (e) {
//       evalOfTests.push(false)
//     }
//    })
//   return evalOfTests;
// }

router.post('/check-answer', indexCtrl.check)



module.exports = router