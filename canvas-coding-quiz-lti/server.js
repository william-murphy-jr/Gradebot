const express = require('express')
      app = express(),
      bodyParser = require('body-parser'),
      logger = require('morgan'),
      canvas = require('./canvas-api'),
      path = require('path'),
      session = require("express-session"),

      indexRoute = require('./routes/index'),
      ltiRoute = require('./routes/lti'),
      staticPath = path.join(__dirname, "build"),
      PORT = 3030;

app.use(logger('dev'));
app.use(express.static(staticPath));
app.use(bodyParser.json()) // handle json data
app.use(bodyParser.urlencoded({ extended: true }))
app.enable('trust proxy') // this lets req.proto == 'https'
app.use(session({
  secret: "TKRv0IJs=HYqrvagQ#&!F!%V]Ww/4KiVs$s,<<MX",
  resave: true,
  saveUninitialized: true
}));

app.use('/', indexRoute)
app.use('/lti', ltiRoute)









app.listen(PORT, function (err) {
  console.log(err || `ltitool on ${PORT}`)
})

// for debugging
global.canvas = canvas