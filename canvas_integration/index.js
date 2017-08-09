const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const lti = require('ims-lti')
const ejs = require('ejs')
const fetch = require('node-fetch')
const Remarkable = require('remarkable')
const md = new Remarkable({html:true})

function getAssignment(id) {
  /* TODO -- grab this data from gitlab repo */
  const assignment = {
    prompt: "write a function that returns 23",
    tests: [
      "myfun() === 23",
      "typeof myfun === 'function'"
    ],
    template: "function myfun(){}"
  }
  return assignment
}

app.use(express.static('public'))
app.use(bodyParser.urlencoded());
app.enable('trust proxy') // this lets req.proto == 'https'
const consumer_key = 'consumerkey'
const consumer_secret = 'consumersecret'

const canvas_base = 'http://canvas-dev.tlmworks.org'
// created on site admin under /profile
const canvas_api_token = 'PDbk49hfZsQ7CzkCQ6Y9IuBmOXQSfvaTjjQFhYqLVG5Qgcpz0KXiISn2J9Z2rA9G'

async function testCanvasAPI() {
  const headers = {'Authorization':`Bearer ${canvas_api_token}`}
  const result = await fetch(`${canvas_base}/api/v1/courses`, {headers})
  const j = await result.json()
  console.log('API /courses',j)
}

app.get('/gitlab/:org/:repo/:page', async (req, res) => {
  const url = `https://gitlab.tlmworks.org/${req.params.org}/${req.params.repo}/raw/master/${req.params.page}.md`
  console.log('get url',url)
  const resp = await fetch(url)
  const text = await resp.text()
  const html = md.render(text)
  res.send(html)
})

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
      // if external tool is an assignment, then it will have outcome_service_url
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
