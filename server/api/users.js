/**
 * nodejs backend service, using proxy to
 */
const userProxy = require('../proxy').user;
const { respJson } = pub_require('util')
const validator = require('validator')

const users = {
  query(req, res) {
    const opts = req.query || {};
    //TODO: validate body
    userProxy.query(opts, (err, d)=>{
      if(err) {
        return res.json(respJson(500,
          `query user failed. error: ${err}`));
      }
      //hide some attrs

      res.json(respJson(200, d));
    });
  },
  create(req, res) {
    let obj = req.body;
    //TODO: validate body

    userProxy.create(obj, (err, d)=>{
      if(err) {
        return res.json(respJson(500,
          `create user failed. error: ${err}`));
      }
      res.json(respJson(200, d));
    });
  },
  queryByName(req, res) {
    const name = req.params.name;
    userProxy.queryByName(name, (err, d)=>{
      if(err) {
        return res.json(respJson(500,
          `query user by name failed. error: ${err}`));
      }
      res.json(respJson(200, d));
    });
  },
  update(req, res) {
    //TODO: validate body and name

    const obj = req.body;
    const name = obj.name;
    delete obj.name;
    userProxy.update(name, obj, (err)=>{
      if(err) {
        return res.json(respJson(500,
          `update user failed. error: ${err}`))
      }
      res.json(respJson());
    });
  },
  clear(req, res) {
    const name = req.params.name;
    userProxy.clear(name, (err)=>{
      if(err) {
        return res.json(respJson(500,
          `delete user failed. error: ${err}`))
      }
      res.json(respJson());
    });
  }
};

module.exports = users;
