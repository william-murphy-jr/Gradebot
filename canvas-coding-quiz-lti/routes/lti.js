const express = require('express'),
      router = express.Router(),
      bodyParser = require('body-parser'),
      ltiCtrl = require('../controllers/ltiCtrl.js');

router.post('/', ltiCtrl.post)
router.post('/grade', bodyParser.json(), ltiCtrl.submit)
router.get('/:challengeId/:sessionId', ltiCtrl.get)



module.exports = router