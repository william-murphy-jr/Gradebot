const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const lti = require('ims-lti')

app.use(express.static('public'))
app.use(bodyParser.urlencoded());
app.enable('trust proxy') // this lets req.proto == 'https'
const consumer_key = 'consumerkey'
const consumer_secret = 'consumersecret'

app.post('/lti', async (req, res) => {
  const provider = new lti.Provider( consumer_key,
                                     consumer_secret )
  console.log(req.body)
  provider.valid_request(req, (err, isValid) => {
    if (err) {
      console.error('invalid request',err)
      res.send(err + ". check your consumer key and consumer secret.")
    } else {
      console.log('provider good',provider)
      res.send('<pre>'+JSON.stringify(provider,null,2)+"</pre>")
    }
  })
})

app.listen(3030, function () {
  console.log('ltitool on 3030')
})
