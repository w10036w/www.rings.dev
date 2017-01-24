const User = require('../model').User
const uuid = require('node-uuid');

function query(options = {}, cb) {
  User.find({}, cb);
}
function queryByName(name, cb) {
  User.findOne({ name }, cb);
}
function create(obj, cb) {
  let user = new User();
  user.name = obj.name;
  user.username = obj.username || obj.name;
  user.password = obj.password;
  user.email = obj.email;
  user.avatar = obj.avatar || undefined;
  user.provider = obj.provider || 'local';
  user.role = obj.role || 'visitor';
  user.authToken = uuid.v4();
  queryByName(user.name, (err, d)=>{
    if(err) {
      return cb(err);
    }
    if(!d){
      user.save(cb);
    } else {
      console.log('user exists');
      //how to warning the user has existed?
      return cb('user with the name or email exists already');
    }
  })
}
function update(name, obj, cb) {
  let user = {};
  if(obj.username) user.username = obj.username;
  if(obj.password) user.password = obj.password;
  if(obj.email) user.email = obj.email;
  if(obj.avatar) user.avatar = obj.avatar;
  if(obj.role) user.role = obj.role;
  User.update({ name }, user, {}, cb);
}
function clear(name, cb) {
  User.remove({ name }, cb);
}
module.exports = {
  query,
  queryByName,
  create,
  update,
  clear
}