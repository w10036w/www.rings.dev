const mwAuth = require('../middleware').auth;
const User = require('../model').User;

const redirect = {
  failureRedirect: '/login',
  successRedirect: '/user'
};
const auth = {
  logout(req, res) {
    req.logout();
    res.redirect('/login');
  },
  login(req, res) {
    const redirectTo = req.session.returnTo
      ? req.session.returnTo
      : '/';
    console.log(redirectTo);
    delete req.session.returnTo;
    res.redirect(redirectTo);
  }
};
module.exports = (app, passport) => {
  const pauth = passport.authenticate.bind(passport);

  app.get('/auth/facebook', passport.authenticate('facebook'));
  app.get('/auth/facebook/callback', pauth('facebook', redirect));

  app.get('/auth/twitter', passport.authenticate('twitter'));
  app.get('/auth/twitter/callback', passport.authenticate('twitter', redirect));

  app.get('/auth/google', pauth('google', Object.assign(redirect, {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  })));
  app.get('/auth/google/callback', passport.authenticate('google', redirect));

  app.post('/auth/local', pauth('local', {
    failureRedirect: '/login',
    failureFlash: true
  }), auth.login);

  //TODO: change to vue routers
  app.get('/login', mwAuth.guestOnly, (req, res)=>{
    var error = req.flash('error') || "";
    res.render('login', {
      error
    });
  });
  app.get('/signup', mwAuth.guestOnly, (req, res)=>{
    var error = req.flash('error') || "";
    res.render('signup', {
      title: 'Sign up',
      user: new User(),
      error
    });
  });
  app.get('/logout', mwAuth.userOnly, auth.logout);
  app.get('/test', mwAuth.userOnly, (req, res)=>{
    console.log('session: ', req.session);
    console.log('user: ', req.user);
    res.send('login success and pass user only test');
  });
};