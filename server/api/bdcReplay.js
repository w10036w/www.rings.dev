const host = root_require('config').host;
const { _fetch, respJson, fmtResp, vstr } = pub_require('util')
const validator = require('validator')
const url = `${host}/r/j/broadcast_replay/%s/1000/0?_appid=nodejs`

module.exports = {

  /** 21 get replays by eid
   * param: eid
   */
  event_replays(req, res) {
    const params = req.params
    if(!params.eid)
      return respJson(400, 'invalid param: eid')
    const opts = {}
    opts.event_id = params.eid
    const uri = vstr(url, 21, 100)
    return _fetch(uri, opts).then(resp=>res.json(fmtResp(resp)))
  },
}
