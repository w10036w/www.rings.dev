const pkg = require('package.json')
const schema = pkg.schema
const host = pkg.host
const port = pkg.port
const debug = pkg.debug

const api = `${schema}://${host}:${port}/api/`

const data = {
  live_list: 'data/recommend/live_list'
}
module.exports = {
  api, debug, data
}