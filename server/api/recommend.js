const host = root_require('config').host;
const { _fetch, respJson, fmtResp, vstr } = pub_require('util')
const validator = require('validator')

const url = `${host}/r/j/content_recommend/%s/1000/0?_appid=nodejs`

//1000 can be replaced by req.user, if real authorized user

// should have event_info model mapper
// since api is broken and non-standarded, who cares
module.exports = {
  /** 1
   * query: user_id, start=0, limit, sort_flag=0 */
  live_list(req, res) {
    const query = req.query
    const opts= {}
    opts.start = query.start ? parseInt(query.start) : 0
    opts.limit = parseInt(query.limit) || 20
    opts.sort_flag = parseInt(query.sort_flag) || 0
    opts.user_id = parseInt(query.user_id) || undefined
    const uri = vstr(url, 1)
    return _fetch(uri, opts).then(resp=>res.json(fmtResp(resp)))
  },
  /** 2
   * query: user_id, start=0, limit, category_id, sort_flag=0 */
  upcoming_list(req, res) {
    const query = req.query
    const opts= {}
    opts.start = parseInt(query.start) || 0
    opts.limit = parseInt(query.limit) || 20
    opts.sort_flag = parseInt(query.sort_flag) || 0
    opts.user_id = parseInt(query.user_id) || undefined
    opts.category_id = parseInt(query.category_id) || undefined
    const uri = vstr(url, 2)
    return _fetch(uri, opts).then(resp=>res.json(fmtResp(resp)))
  },
  /** 3
   * query: user_id, start=0, limit, category_id, sort_flag=0 */
  replay_list(req, res) {
    const query = req.query
    const opts= {}
    opts.start = parseInt(query.start) || 0
    opts.limit = parseInt(query.limit) || 20
    opts.sort_flag = parseInt(query.sort_flag) || 0
    opts.user_id = parseInt(query.user_id) || undefined
    opts.category_id = parseInt(query.category_id) || undefined
    const uri = vstr(url, 3)
    return _fetch(uri, opts).then(resp=>res.json(fmtResp(resp)))
  },
  /** 4
   * query: user_id, start, limit(except lives+top_most_replays), sort_flag=0 */
  live_replay_list(req, res) {
    const query = req.query
    const opts= {}
    opts.start = parseInt(query.start) || 0
    opts.limit = parseInt(query.limit) || 0
    opts.sort_flag = parseInt(query.sort_flag) || 0
    opts.user_id = parseInt(query.user_id) || undefined
    const uri = vstr(url, 4)
    return _fetch(uri, opts).then(resp=>res.json(fmtResp(resp)))
  },
  /** 5
   * params: user_id(not null)
   * query: start, limit */
  event_list(req, res) {
    const params = req.params
    const query = req.query
    if(!params.user_id)
      return respJson(400, 'invalid parameter user_id')
    const opts = {}
    opts.user_id = parseInt(params.user_id)
    opts.start = parseInt(query.start) || 0
    opts.limit = parseInt(query.limit) || 20
    const uri = vstr(url, 5)
    return _fetch(uri, opts).then(resp=>res.json(fmtResp(resp)))
  },
  /** 6
   * params: category_id */
  channel_list(req, res) {
    const params = req.params
    const opts = {}
    if(params.category_id) opts.category_id = parseInt(params.category_id)
    const uri = vstr(url, 6)
    return _fetch(uri, opts).then(resp=>res.json(fmtResp(resp)))
  },
  /** 7 following_events
   * get all followed channels live+upcoming+replay of the user
   * params: user_id(not null)
   * query: start, limit(constraint for replay)
   */
  following_events(req, res) {
    const params = req.params
    const query = req.query
    if(!params.user_id)
      return respJson(400, 'invalid parameter user_id')
    const opts = {}
    opts.user_id = parseInt(params.user_id)
    opts.start = parseInt(query.start) || 0
    opts.limit = parseInt(query.limit) || 20
    const uri = vstr(url, 7)
    return _fetch(uri, opts).then(resp=>res.json(fmtResp(resp)))
  },
  /** 8 promote_replay
   * promote a featured replay
   * params: media_id(not null)
   * body: weight, expire_date(ts, default after 1 week if null)
   */
  promote_replay(req, res) {
    const params = req.params
    const body = req.body
    if(!params.media_id)
      return respJson(400, 'invalid parameter media_id')
    const opts = {}
    opts.media_id = parseInt(params.media_id)
    opts.weight = parseInt(body.weight) || 0
    opts.expire_date = Math.floor(Number(body.expire_date)) || undefined
    const uri = vstr(url, 8)
    return _fetch(uri, opts).then(resp=>res.json(fmtResp(resp)))
  },
  /** 9 unpromote_replay
   * params: media_id(not null)
   */
  unpromote_replay(req, res) {
    const params = req.params
    if(!params.media_id)
      return respJson(400, 'invalid parameter media_id')
    const opts = {}
    opts.media_id = parseInt(params.media_id)
    const uri = vstr(url, 9)
    return _fetch(uri, opts).then(resp=>res.json(fmtResp(resp)))
  },
  /** 10 top replays
   */
  top_replays(req, res) {
    const opts = {}
    const uri = vstr(url, 10)
    return _fetch(uri, opts).then(resp=>res.json(fmtResp(resp)))
  },

  /** 12 search event and channel
   * query: keyword(not null)
   */
  search_events_channels(req, res) {
    const query = req.query
    if(!query.keyword)
      return respJson(400, 'invalid query keyword')
    const opts = {}
    opts.keyword = decodeURIComponent(query.keyword)
    const uri = vstr(url, 12)
    return _fetch(uri, opts).then(resp=>res.json(fmtResp(resp)))
  },

  /** 14 get event info by channel session
   * query: keyword(not null)
   */
  event_info(req, res) {
    const params = req.params
    if(!params.cid) return respJson(400, 'invalid parameter cid')
    if(!params.sid) return respJson(400, 'invalid parameter sid')
    const opts = {}
    opts.channel_id = parseInt(params.cid)
    opts.session_id = params.sid
    const uri = vstr(url, 14)
    return _fetch(uri, opts).then(resp=>res.json(fmtResp(resp)))
  },
  /** 15,19 get only replays by host id/ad ids
   * query: host_id, ad_ids, start, limit
   */
  replays(req, res) {
    const query = req.query
    const opts = {}
    if(query.hid) opts.host_id = parseInt(query.hid)
    if(query.aid) opts.ad_ids = parseInt(query.aid)
    let num = 0
    if(opts.host_id) num=15
    if(opts.ad_ids) num=19
    if(!num) return respJson(400, 'invalid query: hid or aid')
    opts.start = parseInt(query.start) || 0
    opts.limit = parseInt(query.limit) || 20
    const uri = vstr(url, num)
    return _fetch(uri, opts).then(resp=>res.json(fmtResp(resp)))
  },
  /** 16 get live & replay by event id
   * params: eid
   */
  live_replay(req, res) {
    const query = req.query
    if(!query.eid)
      return respJson(400, 'invalid query: eid')
    const opts = {}
    if(query.eid) opts.event_id = query.eid
    const uri = vstr(url, 16)
    return _fetch(uri, opts).then(resp=>res.json(fmtResp(resp)))
  },

  /** 20 get upcomings by ids
   * query: ids {string}l
   * note: return null if passed
   */
  upcomings(req, res) {
    const params = req.params
    if(!params.eid) return respJson(400, 'invalid parameter eid')
    const opts = {}
    opts.ids = params.eid
    const uri = vstr(url, 20)
    return _fetch(uri, opts).then(resp=>res.json(fmtResp(resp)))
  },
  /** 21 get featured replay with category id, leave null
   * params: id {int}
   * ip: category_id
   * op: [ category_with_replays ]
   */
  replays_category(req, res) {
    const params = req.params
    const opts = {}
    opts.category_id = parseInt(params.id) || undefined
    const uri = vstr(url, 21)
    return _fetch(uri, opts).then(resp=>{
      resp = fmtResp(resp)
      if(resp.code===200) resp.data = resp.data.category_with_replays
      return res.json(resp)
    })
  },
}