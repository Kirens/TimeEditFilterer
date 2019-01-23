const fp = require('lodash/fp')
const ical = require('ical-generator')
const par = require('ical')
const parser = fp.flow(
  ics => par.parseICS(ics),
  fp.values,
)

const filters = [
  /^[A-Z]{3}\d{3}/,
  /^Ledigt/,
  /^Tentamen/,
  /^Omtentamen/,
  /^Självstudier/,
  /^CHARM/,
  /^Personlig utveckling -Of course/,
  /^Tentaanmälan/,
  /^Anmälan/,
]

const filterSchedule =
  fp.filter(({ summary }) => !filters.some(f => summary.match(f)))

const formatEventsForIcal =
  fp.map(
    ({ description, end, location, start, summary, uid, dtsamp  }) =>
    ({ description, end, location, start, summary, uid, timestamp: dtsamp })
  )

module.exports = calopts => fp.flow(
  parser,
  filterSchedule,
  formatEventsForIcal,
  events => ical({ ...calopts, events }),
  cal => cal.toString(),
)
