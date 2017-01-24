const host = root_require('config').host;
const { _fetch, respJson, fmtResp, vstr } = pub_require('util')
const validator = require('validator')

const url = `${host}/r/j/broadcast_info/%s/%s/0?_appid=nodejs`

module.exports = {

  /** 5 follow
   * param: uid, hid
   */
  follow(req, res) {
    const params = req.params
    if(!params.uid || !validator.isInt(params.uid))
      return respJson(400, 'invalid param: uid')
    if(!params.hid || !validator.isInt(params.hid))
      return respJson(400, 'invalid param: hid')
    const opts = {}
    opts.host_id = params.hid
    const uri = vstr(url, 5, params.uid)
    return _fetch(uri, opts).then(resp=>res.json(fmtResp(resp)))
  },
  /** 6 unfollow
   * param: uid, hid
   */
  unfollow(req, res) {
    const params = req.params
    if(!params.uid || !validator.isInt(params.uid))
      return respJson(400, 'invalid param: uid')
    if(!params.hid || !validator.isInt(params.hid))
      return respJson(400, 'invalid param: hid')
    const opts = {}
    opts.host_id = params.hid
    const uri = vstr(url, 6, params.uid)
    return _fetch(uri, opts).then(resp=>res.json(fmtResp(resp)))
  },

  /** 18 get following users
   * param: tid
   * query: start, limit=20
   * ip: target_id, start, limit
   * op: channel_host, end(1 if all listed)
   */
  followings(req, res) {
    const params = req.params
    const query = req.query
    if(!params.tid || !validator.isInt(params.tid))
      return respJson(400, 'invalid param: tid')
    if(query.start && !validator.isInt(query.start))
      return respJson(400, 'invalid query: start')
    if(query.limit && !validator.isInt(query.limit))
      return respJson(400, 'invalid query: limit')
    const opts = {}
    opts.target_id = parseInt(params.tid)
    opts.start = query.start ? parseInt(query.start) : 0
    opts.limit = query.limit ? parseInt(query.limit) : 200
    const uri = vstr(url, 18, 1000)

    // only for this wired one, no need to hoist
    function fmtData(data){
      const end = data.end
      data = data.channel_host
      if(!data || data.length===0) return []
      let op = []
      let i = -1
      let l = data.length
      while(++i<l) {
        op.push(e.user_info)
      }
      return {
        following_info: op,
        end
      }
    }
    return _fetch(uri, opts).then(resp=>{
      resp = fmtResp(resp)
      if(typeof resp.data.channel_host==='undefined')
        return res.json(resp)
      resp.data = fmtData(resp.data)
      res.json(resp)
    })
  },


  /** 20 get followers
   * param: hid
   * query: start, limit
   * ip: host_id, start, limit
   * op: follower_info, end(1 if all listed), total
   */
  followers(req, res) {
    const params = req.params
    const query = req.query
    if(!params.hid || !validator.isInt(params.hid))
      return respJson(400, 'invalid param: hid')
    if(query.start && !validator.isInt(query.start))
      return respJson(400, 'invalid query: start')
    if(query.limit && !validator.isInt(query.limit))
      return respJson(400, 'invalid query: limit')
    const opts = {}
    opts.host_id = parseInt(params.hid)
    opts.start = query.start ? parseInt(query.start) : 0
    opts.limit = query.limit ? parseInt(query.limit) : 50
    const uri = vstr(url, 20, 1000)
    return _fetch(uri, opts).then(resp=>res.json(fmtResp(resp)))
  },

  /** 25 search channel
   * param: hid
   * query:
   * ip:
   * op:
   */
  search(req, res) {

  },
  /** 26 search auto complete
   * param: hid
   * query:
   * ip:
   * op:
   */
  search_auto_complete(req, res) {

  },
  /** 27 get host info
   * param: hid
   * ip: user_ids
   * op: { [profile_channel: {profile,channel}] }
   */
  host_info(req, res) {
    const params = req.params
    if(!params.uid || !validator.isInt(params.uid))
      return respJson(400, 'invalid param: uid')
    const opts = {}
    opts.user_ids = Number(params.uid)
    const uri = vstr(url, 27, 1000)
    return _fetch(uri, opts).then(resp=>res.json(fmtResp(resp)))
  },

  /** 44 update viewer count
   * param: cid
   * body: count
   */
  update_pv(req, res) {
    const params = req.params
    const body = req.body
    if(!params.cid || !validator.isInt(params.cid))
      return respJson(400, 'invalid param: cid')
    if(!body.count || !validator.isInt(''+body.count))
      return respJson(400, 'invalid body: count')
    const opts = {}
    opts.channel_id = params.cid
    opts.count = body.count
    const uri = vstr(url, 44, 1000)
    return _fetch(uri, opts).then(resp=>res.json(fmtResp(resp)))
  },

  /** 47 follow all
   * param: uid
   * body: hids
   */
  follow_all(req, res) {
    const params = req.params
    const body = req.body
    if(!params.uid || !validator.isInt(params.uid))
      return respJson(400, 'invalid param: uid')
    if(!body.hids || !body.hids.length)
      return respJson(400, 'invalid body: hids')
    const opts = {}
    opts.host_id = body.hids
    const uri = vstr(url, 47, params.uid)
    return _fetch(uri, opts).then(resp=>res.json(fmtResp(resp)))
  },
  /** 48 unfollow all
   * param: uuid
   * body: hids
   */
  unfollow_all(req, res) {
    const params = req.params
    const body = req.body
    if(!params.uid || !validator.isInt(params.uid))
      return respJson(400, 'invalid param: uid')
    if(!body.hids || !body.hids.length)
      return respJson(400, 'invalid body: hids')
    const opts = {}
    opts.host_id = body.hids
    const uri = vstr(url, 48, params.uid)
    return _fetch(uri, opts).then(resp=>res.json(fmtResp(resp)))
  },

  /** 53 top fans
   * param: cid, sid
   * query: number=5
   */
  top_fans(req, res) {
    const params = req.params
    const query = req.query
    if(!params.cid || !validator.isInt(params.cid))
      return respJson(400, 'invalid param: cid')
    if(!params.sid)
      return respJson(400, 'invalid param: sid')
    if(query.number && !validator.isInt(query.number))
      return respJson(400, 'invalid query: number')
    const opts = {}
    opts.channel_id = parseInt(params.cid)
    opts.session_id = params.sid
    if(query.number) opts.number = parseInt(query.number)
    const uri = vstr(url, 53, 1000)
    return _fetch(uri, opts).then(resp=>res.json(fmtResp(resp)))
  },
  /** 57 admin embedded promote
   * param:
   */
  add_itp(req, res) {

  },
  /** 58 pool live stat
   * get online_count + itp / vote?
   * param: cid
   */
  live_stat(req, res) {
    const params = req.params
    if(!params.cid || !validator.isInt(params.cid))
      return respJson(400, 'invalid param: cid')
    const opts = {}
    opts.channel_id = parseInt(params.cid)
    const uri = vstr(url, 58, 1000)
    return _fetch(uri, opts).then(resp=>res.json(fmtResp(resp)))
  },
  /** 59 replay ad
   * param: mid
   */
  replay_ad(req, res) {
    const params = req.params
    if(!params.mid || !validator.isInt(params.mid))
      return respJson(400, 'invalid param: mid')
    const opts = {}
    opts.media_id = parseInt(params.mid)
    const uri = vstr(url, 59, 1000)
    return _fetch(uri, opts).then(resp=>res.json(fmtResp(resp)))
  }
}