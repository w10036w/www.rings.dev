const { respJson } = require('../../public/util');

function failure(req, res, type = 'api', msg, action = '/login') {
  msg = `Permission denied: ${msg}`;
  req.flash('error', msg);
  return type === 'api' ?
    res.status(401).json(respJson(401, msg))
    : res.redirect(action);
}
function isAdmin(req) {
  return req.isAuthenticated()
    && req.user && /admin/gi.test(req.user.role);
}
function isSelf(req) {
  return req.isAuthenticated()
    && req.user && req.user.name
    && req.body && req.body.name
    && req.user.name !== req.body.name;
}

function adminOnly(req, res, next) {
  if (!req.isAuthenticated()) {
    return failure(req, res, 'web', 'login required');
  }
  if (!isAdmin(req)) {
    return failure(req, res, 'web', 'admin only', 'back');
  }
  next();
}
function userOnly(req, res, next) {
  if (!req.isAuthenticated()) {
    req.flash('error', 'user only');
    return res.redirect('/login');
  }
  next();
}
function selfOrAdminOnly(req, res, next) {
  if (!isAdmin(req) && !isSelf(req)) {
    req.flash('error', 'self only');
    return res.redirect('back');
  }
  next();
}
function guestOnly(req, res, next) {
  if (req.isAuthenticated()) {
    req.flash('info', 'You have logged in');
    return res.redirect('/');
  } else {
    next();
  }
}
function userAgent(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401)
      .json(respJson(401, 'user agent failed'));
  }
  next();
}
function adminAgent(req, res, next) {
  if (!isAdmin(req)) {
    return res.status(401)
      .json(respJson(401, 'admin agent failed'))
  }
  next();
}
function selfOrAdminAgent(req, res, next) {
  if (!isAdmin(req) && !isSelf(req)) {
    return res.status(401)
      .json(respJson(401, 'self and admin agent failed'));
  }
  next();
}

module.exports = {
  adminOnly, userOnly, selfOrAdminOnly, guestOnly,
  adminAgent, userAgent, selfOrAdminAgent,
};