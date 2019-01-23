const fp = require('lodash/fp')
const fetch = require('node-fetch')
const http = require('http')
const { filter,  urlParser } = require('./lib.js')

const respond =
  ({ status = 500, headers = {} }) => response => data => {
  response.writeHead(status, headers)
  response.end(data)
}

const sendCal =
  respond({ status: 200, headers: {
    'Content-Type': 'text/calendar; charset=UTF-8',
    'Content-Disposition': 'attachment; filename="calendar.ics"'
  }})

const bad = respond({ status: 400 })
http
  .createServer(async (request, response) => {
    try {
      const toFilter = urlParser(request.url)
      console.log('Request for', toFilter)
      toFilter
      ? fetch(toFilter)
          .then(res => res.text())
          .then(filter({ name: 'Filtered Calendar',}))
          .then(e => console.log('parsed') || e)
          .then(sendCal(response))
      : bad(response)
    } catch(e) {
      console.error(e)
      fail(response)
    }
  })
  .listen(8080)
