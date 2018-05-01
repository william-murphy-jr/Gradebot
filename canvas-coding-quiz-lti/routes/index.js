const express = require('express')
const router = express.Router()
const indexCtrl = require('../controllers/indexCtrl.js')

router.get('/get-state', indexCtrl.get)
router.post('/check-answer', indexCtrl.check)

module.exports = router