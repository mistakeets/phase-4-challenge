var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var db = require('../database')
var User = require('../model/user')

passport.use('login', new LocalStrategy({ usernameField: 'email', passwordField: 'password', passReqToCallback: true, session: true },
  (req, username, password, done) => {
    let user = User.isValidUser(username, password);
    user.then((result) => {
      done(null, result)
    }).catch((err) => {
      done(null, false)
    })
  }
))

passport.serializeUser((user, done) => {
  done(null, user.email);
})

passport.deserializeUser((email, done) => {
  User.findByEmail(email)
    .then(user => {
      done(null, user);
    })
})

module.exports = passport
