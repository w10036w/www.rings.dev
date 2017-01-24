const host = root_require('config').host;
const { _fetch, respJson, fmtResp, vstr } = pub_require('util')
const validator = require('validator')

const url = `${host}/r/j/broadcast_msg/%s/1000/0?_appid=nodejs`
// 1000 can be replaced by req.user, if real authorized user

// should be model mapper or whatever with basic format and validation, in future
// but, a good api provider should always have good design and documentation,
// or use nice protocol, such as graphql
function fmtMsg(data){
  let op = []
  let i = -1
  let l = data.msg_info.length
  // faster than Array.forEach
  while(++i<l) {
    let e = data.msg_info[i]
    op.push({
      id: e.msg_id,
      ts: e.timestamp,
      seq: e.seq,
      uid: e.sender,
      cid: e.target_id,
      sid: e.session_id,
      name: e.sender_name,
      type: e.msg_body.text_msg? 0:1, //0 text 1 gift
      content: e.msg_body.text_msg ?
        e.msg_body.text_msg.text :
        e.msg_body.gift_msg.item_id,
      avatar: e.sender_avator
    })
  }
  return op
}

module.exports = {

  /** 2 get live comment
   * param: cid
   */
  live(req, res) {
    const params = req.params
    if(!params.cid)
      return respJson(400, 'invalid param: cid')
    const opts = {
      target_id: parseInt(params.cid),
      seq:0,
      count:200,
      is_reversed:false,
    }
    const uri = vstr(url, 2)
    return _fetch(uri, opts).then(resp=>{
      resp = fmtResp(resp)
      if(resp.code===200 && resp.data.msg_info
        && resp.data.msg_info.length){
        resp.data.msg_info = fmtMsg(resp.data)
      }else{
        resp.data.msg_info = []
      }
      res.json(resp)
    })
  },

  /** 5 get replay comment
   * param: sid
   */
  replay(req, res) {
    const params = req.params
    const query = req.query
    if(!params.sid)
      return respJson(400, 'invalid param: sid')
    if(query.seq && !validator.isInt(query.seq))
      return respJson(400, 'invalid query: seq')
    const opts = {
      session_id: params.sid,
      seq: Number(query.seq)||0,
      count: 200
    }
    const uri = vstr(url, 5)
    return _fetch(uri, opts).then(resp=>{
      resp = fmtResp(resp)
      if(resp.code===200 && resp.data.msg_info
        && resp.data.msg_info.length){
        resp.data.msg_info = fmtMsg(resp.data)
      }else{
        resp.data.msg_info = []
      }
      res.json(resp)
    })
  },
}
