// example code for rendering a plain markdown view of a gitlab/github markdown readme
const Remarkable = require('remarkable')
const ropts = {typographer: true,html:true,linkify:true,linkTarget:"_blank"}
const md = new Remarkable(ropts)
const fetch = require('node-fetch')
const express = require('express')
const app = express()

app.get('/gitlab/:org/:repo/:page', async (req, res) => {
  const url = `https://gitlab.tlmworks.org/${req.params.org}/${req.params.repo}/wikis/${req.params.page}.md`
  console.log('get url',url)
  const resp = await fetch(url)
  const text = await resp.text()
  const html = md.render(text)
  res.send(html)
})

const fetch = require('node-fetch')
const express = require('express')
const app = express()
