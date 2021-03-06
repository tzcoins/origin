const express = require('express')
const cors = require('cors')
const serveStatic = require('serve-static')
const fetch = require('node-fetch')
const fs = require('fs')

const app = express()
const html = fs.readFileSync(`${__dirname}/public/index.html`).toString()

app.use(cors({ origin: true, credentials: true }))

app.use(serveStatic(`${__dirname}/public`))

require('./routes/auth')(app)
require('./routes/orders')(app)
require('./routes/stripe')(app)
require('./routes/discounts')(app)

app.get('(/collections/:collection)?/products/:product', async (req, res) => {
  const url = `${process.env.DATA_URL}${req.params.product}/data.json`
  const dataRaw = await fetch(url)
  if (dataRaw.ok) {
    const data = await dataRaw.json()
    let modifiedHtml = html
    if (data.title) {
      modifiedHtml = modifiedHtml.replace(
        /<title>.*<\/title>/,
        `<title>${data.title}</title>`
      )
    }
    if (data.head) {
      modifiedHtml = modifiedHtml
        .replace('</head>', data.head.join('\n') + '\n</head>')
        .replace('DATA_URL', process.env.DATA_URL)
    }
    res.send(modifiedHtml)
  } else {
    res.send(html)
  }
})

app.get('*', (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`)
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`\nListening on port ${PORT}\n`)
})
