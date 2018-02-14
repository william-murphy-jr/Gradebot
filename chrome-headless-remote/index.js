const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const CDP = require('chrome-remote-interface')
const chromeLauncher = require('chrome-launcher')
// const log = require('lighthouse-logger');
// log.setLevel('info');

const selfLaunch = true
function launchChrome(headless=true) {
  return chromeLauncher.launch({
    port: 9222,
    chromeFlags: [
      '--window-size=412,732',
      '--disable-gpu',
      headless ? '--headless' : ''
    ]
  });
}


async function runTest(code,tests,debugLevel) {
  const results = {}
  try {
    console.log('looking for chrome headless. (launch chrome --headless --remote-debugging-port=9222')
    var client = await CDP();
    console.log('got chrome headless')
    const {Network, Page, Runtime} = client;
    Network.requestWillBeSent((params) => {
      console.log('chrome headless nav:',params.request.url);
    });
    await Promise.all([Network.enable(), Page.enable()]);
    await Page.navigate({url: 'http://localhost:3000/gradebot.html'});
    await Page.loadEventFired();
    // function definition
    console.log('running user function definition',code)
    results.code = await Runtime.evaluate({expression:code})
    if (! Array.isArray(tests)) {
      tests = [tests]
    }
    console.log('running tests',tests)
    results.tests = []
    for (const test of tests) {
      results.tests.push( await Runtime.evaluate({expression:test}) )
    }
  } catch (err) {
    console.error(err);
  } finally {
    if (client) {
      await client.close();
    }
    return results
  }
}

app.use(express.static('public'))
app.use(bodyParser.json());

app.get('/', function (req, res) {
  console.log("in")
  res.send('Hello World!')
})

app.get('/hello', (req, res) => {
  console.log("hello")
})
app.post('/api/grade', async (req, res) => {
  const code = req.body['code']
  const tests = req.body['tests']
  const debugLevel = req.body['debugLevel']
  const results = await runTest(code,tests,debugLevel)
  res.send(results)
})

const port = 3000
app.listen(port, function () {
  console.log(`Gradebot listening on ${port}`)

  launchChrome().then(chrome => {
    console.log(`Chrome debuggable on port: ${chrome.port}`);
    // chrome.kill();
  });

})
