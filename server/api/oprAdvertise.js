const host = root_require('config').host;
const { _fetch, fmtResp, vstr } = pub_require('util')
const validator = require('validator')

const url = `${host}/r/j/operation_advertisement/%s/1000/0?_appid=nodejs`;

module.exports = {
  /** 1 get all banner ads
   * param: eid
   */
  get_all(req, res) {
    const opts = {};
    const uri = vstr(url, 1);
    return _fetch(uri, opts).then(resp=>{
      resp = fmtResp(resp)
      if(resp.code===200)
        resp.data = resp.data.advertisement_info
      res.json(resp)
    })
  },
};
