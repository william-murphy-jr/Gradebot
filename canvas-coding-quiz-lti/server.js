const express = require('express')
      bodyParser = require('body-parser'),
      logger = require('morgan'),
      canvas = require('./canvas-api'),
      path = require('path'),
      session = require("express-session"),

      indexRoute = require('./routes/index'),
      ltiRoute = require('./routes/lti'),
      PORT = 3030,

      app = express();

app.use(logger('dev'));
app.use(bodyParser.json()) // handle json data
app.use(bodyParser.urlencoded({ extended: true }))
app.enable('trust proxy') // this lets req.proto == 'https'
app.use(session({
  secret: "TKRv0IJs=HYqrvagQ#&!F!%V]Ww/4KiVs$s,<<MX",
  resave: true,
  saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, "/client/build")));

app.use('/', indexRoute)
app.use('/lti', ltiRoute)

app.get('*', (req, res) => {
  res.send('./client/public/index.html')
})

app.listen(PORT, function (err) {
  console.log(err || `ltitool on ${PORT}`)
})

// for debugging
global.canvas = canvas