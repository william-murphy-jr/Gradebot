const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const lti = require('ims-lti')
const ejs = require('ejs')

function getAssignment(id) {
  const assignment = {
    prompt: "write a function that returns 23",
    template: "function myfun(){}"
  }
  return assignment
}

app.use(express.static('public'))
app.use(bodyParser.urlencoded());
app.enable('trust proxy') // this lets req.proto == 'https'
const consumer_key = 'consumerkey'
const consumer_secret = 'consumersecret'

app.post('/lti', async (req, res) => {
  const provider = new lti.Provider( consumer_key,
                                     consumer_secret )
  console.log('lti launch params',req.body)
  provider.valid_request(req, (err, isValid) => {
    if (err) {
      console.error('invalid request',err)
      res.send(err + ". check your consumer key and consumer secret.")
    } else {
      console.log('provider good',provider)
      /*
      res.send('<pre>'
               +JSON.stringify(req.body,null,2)
               +JSON.stringify(provider,null,2)
               +"</pre>")
*/
      // test send LTI result ?

      // if external tool is an assignment, then it will have outcome_service_url

      //res.sendfile('public/lti.html')
      var assignment
      if (req.query.assignmentid) {
        // fetch the assignment id information
        assignment = getAssignment(req.query.assignmentid)
      }
      const tdata = {
        body:req.body,
        assignment:assignment,
        provider:provider
      }
      ejs.renderFile('views/lti.html', tdata, null, (err,str) => {
        res.send(str)
      })

      
    }
  })
})
const port = 3030
app.listen(port, function () {
  console.log(`ltitool on ${port}`)
})
