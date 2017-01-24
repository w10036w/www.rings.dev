const host = root_require('config').host;
const { _fetch, respJson, fmtResp, vstr } = pub_require('util')
const validator = require('validator')
const url = `${host}/r/j/broadcast_session/%s/1000/0?_appid=nodejs`

module.exports = {

  /** 21 send session like
   * param: cid, sid
   * ip: video_session_id, like_count
   * op: like_count
   */
  like(req, res) {
    const params = req.params
    const body = req.body
    if(!params.sid)
      return respJson(400, 'invalid param: sid')
    if(!body.count)
      return respJson(400, 'invalid body: count')
    const opts = {}
    opts.video_session_id = params.sid
    opts.like_count = body.count
    const uri = vstr(url, 21, 100)
    return _fetch(uri, opts).then(resp=>res.json(fmtResp(resp)))
  },

  /** 26 get live stat
   * param: cid, sid
   *
   * op: {received_coins, watched_pvs, like_count}
   */
  stat(req, res) {
    const params = req.params
    if(!params.cid || !validator.isInt(params.cid))
      return respJson(400, 'invalid param: cid')
    if(!params.sid)
      return respJson(400, 'invalid param: sid')
    const opts = {}
    opts.channel_id = parseInt(params.cid)
    opts.session_id = params.sid
    const uri = vstr(url, 26, 100)
    return _fetch(uri, opts).then(resp=>res.json(fmtResp(resp)))
  },
}
