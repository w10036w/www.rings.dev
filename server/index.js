const express = require('express');
const config = require('../config');
const path = require('path')

const session = require('express-session')
const compression = require('compression')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')()
//const cookieSession = require('cookie-session')
const methodOverride = require('method-override')
//const csrf = require('csurf') // prepare for csrf protection
const cors = require('cors')
const flash = require('connect-flash')

// config node path
global.root_require = name => require(`${__dirname}/../${name}/`)
global.pub_require = name => require(`${__dirname}/../public/${name}`)

function setup(app) {
  app = app || express();
  // body parser above methodOverride
  app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(methodOverride(function (req) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      const method = req.body._method;
      delete req.body._method;
      return method;
    }
  }));
  // TODO: db import & connect
  app.use(cookieParser);
  //app.use(csrf({ cookie:true }));
  app.use(flash());
  useApi(app); // use api

  // database config
  /*
  // mongodb config
  const mongoose = require('mongoose')
  const mongoStore = require('connect-mongo')(session)
  const model = require('./model'); // initial model for mongoose
  connect()
    .on('error', console.log)
    .on('disconnected', connect)
  function connect() {
    var opts = { server: { socketOptions: { keepAlive: 1 } } };
    mongoose.Promise = global.Promise;
    return mongoose.connect(config.db, opts).connection;
  }
  // MySQL config with sequelize.js
  const Sequelize = require('sequelize');

  /!** cookie above session *!/
  const store = new mongoStore({
    url: config.db,
    collection: 'sessions'
  });
  useSession(app, store);
  usePassport(app); // use passport
*/
  return app;
}

// for session use
/*function useSession(app, store = null) {
  let sessionData = {
    secret: '&*^(Tg8vcdyfe293r',
    resave: true,
    saveUninitialized: false,
    cookie:{
      maxAge: 1000*60*60*24*163
    }
  }
  if(store) { sessionData.store = store; }
  app.use(session(sessionData));
}*/

// for passport use
/*function usePassport(app) {
  const passport = require('passport');
  const local = require('./pass/local');
  const facebook = require('./pass/facebook');
  const twitter = require('./pass/twitter');
  //const google = require('./pass/google');
  //const linkedin = require('./pass/linkedin');
  //const github = require('./pass/github');
  //const instagram = require('./pass/instagram');
  passport.serializeUser((user, cb) => cb(null, user.id));
  passport.deserializeUser((id, cb) => User.load({ criteria: { _id: id } }, cb));

  passport.use(local);
  //passport.use(google);
  app.use(passport.initialize());
  app.use(passport.session());

  require('./pass/route')(app, passport); //setup authentication routers
}*/

function useApi(app) {
  // provide CORS, can be canceled
  app.use('/api', cors(), require('./api'));
}

module.exports = () => {
  return setup();
}

