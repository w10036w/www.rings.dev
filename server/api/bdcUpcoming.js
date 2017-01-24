const host = root_require('config').host;
const { _fetch, respJson, fmtResp, vstr } = pub_require('util')
const validator = require('validator')

const url = `${host}/r/j/broadcast_upcomingevent/%s/%s/0?_appid=nodejs`

module.exports = {

  /** 5 get event by id
   * param: eid
   * query: uid
   */
  read(req, res) {
    const params = req.params
    const query = req.query
    if(query.uid && !validator.isInt(query.uid))
      return respJson(400, 'invalid query: uid')
    if(!params.eid)
      return respJson(400, 'invalid param: eid')
    const opts = {}
    opts.event_id = params.eid
    const uri = vstr(url, 5, query.uid || 1)
    return _fetch(uri, opts).then(resp=>res.json(fmtResp(resp)))
  }
}
