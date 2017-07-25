const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const database = require('../database')
const bcrypt = require('bcrypt-nodejs')

// passport.use('login', new LocalStrategy({
//         usernameField: 'email',
//         passwordField: 'password',
//         passReqToCallback: true,
//         session: true
//       },
//       function(req, email, password, done) {
//         database.getUserByEmail(email, (error, user) => {
//           user = user[0]
//           if (!user) {
//             return done(null, false)
//           }
//         })
//       }

passport.use('signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
    session: true
  },
  function(req, email, password, done) {
    user = user[0]
    if (!user) {
      return done(null, false)
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return done(null, false)
    }
    return done(null, user)
  }
))



passport.serializeUser((user, done) => {
  done(null, user.id);
})

passport.deserializeUser(function(id, done) {
  database.getUserByID(id, function(error, user) {
    done(null, user)
  })
})

module.exports = passport
