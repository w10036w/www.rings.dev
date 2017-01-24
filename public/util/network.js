const fetch = require('isomorphic-fetch')

function fetchOpts(body, method='post', type='application/json', mode) {
  let opt = { method };
  if(body) opt.body = JSON.stringify(body)
  if(type) opt.headers = new Headers({
    'Content-Type': type
  })
  if(mode) opt.mode = mode;
  return opt;
}
const respJson = (code=200, note='', data) => {
  if(code === 200 && data === undefined) {
    data = note;
    note = Date.now();
  }
  data = data || null;
  return { code, note, data };
}
// format proto response
const fmtResp = resp => {
  try {
    const code = resp.err_no===0 ? 200 : 400
    const note = resp.err_msg==='OK' ? Date.now() : resp.err_msg
    let data = null
    Object.keys(resp).some(e=>{
      if(e!=='err_no'&&e!=='err_msg') {
        data = resp[e]
        return true
      }
      return false
    })
    return { code, note, data }
  } catch(e) {
    return { code:500, note:e.toString() }
  }
}

// mostly used by Mozat, all server request is POST
const _fetch = (uri, body) => {
  if(!body) return respJson(400, 'empty body')
  if(typeof(body)==='object') body = fetchOpts(body)
  //console.log(body)
  return fetch(uri, body).then(resp=>{
    if(resp.status>=400){
      return respJson(resp.status, 'service error')
    }
    return resp.json()
  }).catch(err=>{
    return respJson(500, err.toString())
  })
}
// prevent server / client to send request in a short period
const cached = (logs, action, sec=.8) => {
  const ts = Date.now()
  let i = logs.length-1
  while(i>=0){
    if(logs[i].name===action && ts-logs[i].note<=sec*1000){
      return true
    }
    i--
  }
  return false
}
module.exports = {
  respJson, fmtResp, _fetch, cached
}