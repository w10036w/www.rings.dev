const network = require('./network')
const strExt = require('./strExt')

module.exports = {
  respJson: network.respJson,
  fmtResp: network.fmtResp,
  _fetch: network._fetch,
  cached: network.cached,

  vstr: strExt.vstr,
}