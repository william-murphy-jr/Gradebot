const express = require('express')
const bodyParser = require('body-parser')
<<<<<<< HEAD
const lti = require('ims-lti')
const fs = require('fs')
=======
const logger = require('morgan')
>>>>>>> react
const canvas = require('./canvas-api')
const path = require('path')
const PORT = 3030

const ltiRoute = require('./routes/lti')

const app = express()

app.use(logger('dev'))
app.use(bodyParser.json()) // handle json data
app.use(bodyParser.urlencoded({ extended: true }))
app.enable('trust proxy') // this lets req.proto == 'https'
app.use(express.static(path.join(__dirname, '/client/build')))
app.use('/lti', ltiRoute)

app.listen(PORT, function (err) {
  console.log(err || `ltitool on ${PORT}`)
})

// for debugging
global.canvas = canvas
