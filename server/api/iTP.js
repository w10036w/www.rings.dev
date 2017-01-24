const host = root_require('config').host;
const { _fetch, respJson, fmtResp, vstr } = pub_require('util')
const validator = require('validator')
const qs = require('qs')

const url = `${host}/embedded-ad/%s`


module.exports = {
  /** 1 create [POST]
   * body: hostId, icon, url
   */
  create(req, res) {
    const body = req.body
    if(!body.hostId || !validator.isInt(''+body.hostId))
      return respJson(400, 'invalid body: hostId')
    if(!body.icon || !validator.isURL(body.icon))
      return respJson(400, 'invalid body: icon')
    if(!body.url || !validator.isURL(body.url))
      return respJson(400, 'invalid body: url')
    const opts = {}
    opts.hostId = body.hostId
    opts.icon = body.icon
    opts.url = body.url
    const uri = vstr(url, 'create')
    return _fetch(uri, opts).then(resp=>{
      const code = resp.success ? 200 : 500
      const note = resp.success ? '' : resp.message
      res.json(respJson(code, note, null))
    })
  },
  /** 2 update [PUT]
   * params: id
   * body: id, hostId, icon, url
   */
  update(req, res) {
    const params = req.params
    const body = req.body
    if(!params.id || !validator.isInt(params.id))
      return respJson(400, 'invalid param: id')
    if(!body.hostId || !validator.isInt(''+body.hostId))
      return respJson(400, 'invalid body: hostId')
    if(!body.icon || !validator.isURL(body.icon))
      return respJson(400, 'invalid body: icon')
    if(!body.url || !validator.isURL(body.url))
      return respJson(400, 'invalid body: url')
    const opts = {}
    opts.id = parseInt(params.id)
    opts.hostId = body.hostId
    opts.icon = body.icon
    opts.url = body.url
    const uri = vstr(url, 'update')
    return _fetch(uri, opts).then(resp=>{
      const code = resp.success ? 200 : 500
      const note = resp.success ? '' : resp.message
      res.json(respJson(code, note, null))
    })
  },
  /** 3 remove [DELETE]
   * parameter: id
   * !! not really delete, just change _deleted=true
   */
  remove(req, res) {
    const params = req.params
    if(!params.id || !validator.isInt(params.id))
      return respJson(400, 'invalid param: id')
    const uri = vstr(url, 'delete')+`?id=${params.id}`
    return _fetch(uri, {}).then(resp=>{
      const code = resp.success ? 200 : 500
      const note = resp.success ? '' : resp.message
      res.json(respJson(code, note, null))
    })
  },
  /** 4 set online [POST]
   * params: id, cid
   * set id=0 to unlink
   */
  online(req, res) {
    const params = req.params
    if(!params.id || !validator.isInt(params.id))
      return respJson(400, 'invalid param: id')
    if(!params.cid || !validator.isInt(params.cid))
      return respJson(400, 'invalid param: cid')
    const uri = vstr(url, 'set-online')
      +`?adId=${params.id}&channelId=${params.cid}`
    return _fetch(uri, {}).then(resp=>{
      const code = resp.success ? 200 : 500
      const note = resp.success ? '' : resp.message
      res.json(respJson(code, note, null))
    })
  },
  /** 5 set replay [POST]
   * params: id, mid
   * set id=0 to unlink
   */
  replay(req, res) {
    const params = req.params
    if(!params.id || !validator.isInt(params.id))
      return respJson(400, 'invalid param: id')
    if(!params.mid || !validator.isInt(params.mid))
      return respJson(400, 'invalid param: mid')
    const uri = vstr(url, 'add-to-replay')
      +`?adId=${params.id}&mediaId=${params.mid}`
    return _fetch(uri, {}).then(resp=>{
      const code = resp.success ? 200 : 500
      const note = resp.success ? '' : resp.message
      res.json(respJson(code, note, null))
    })
  },
  /** 6 index [GET]
   * query: hostId, pageNo, pageSize, getOnlineAndReplay(bool)
   */
  index(req, res) {
    const query = req.query
    const opts = {}
    if(query.hostId) opts.hostId = parseInt(query.hostId)
    if(query.pageNo) opts.pageNo = parseInt(query.pageNo) || 0
    if(query.pageSize) opts.pageSize = parseInt(query.pageSize) || 10
    const uri = vstr(url, 'index')+
      (Object.keys(opts).length ? '?'+qs.stringify(opts) : '')
    return fetch(uri)
      .then(resp=>resp.json()) // y must have this
      .then(resp=>{
        try{
          const code = resp.success ? 200 : 500
          const note = resp.message==='ok' ? '' : resp.message
          const data = {
            ads: resp.integratedEmbeddedAdInfos,
            online: resp.onlineAdId,
            totalPage: resp.totalPageNo,
            totalCount: resp.totalResultNo
          }
          return res.json(respJson(code, note, data))
        }catch(e){
          return res.json(respJson(500, e.toString()))
        }
      })
  }
}
