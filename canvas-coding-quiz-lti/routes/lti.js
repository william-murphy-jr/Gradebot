const express = require('express')
const router = express.Router()
const ltiCtrl = require('../controllers/ltiCtrl.js')

router.post('/', ltiCtrl.post)
router.post('/grade', ltiCtrl.submit)
router.get('/:challengeId/:cheapId/', ltiCtrl.get)
// router.get('/', ltiCtrl.get)

module.exports = router
