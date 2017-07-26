const bcrypt = require('bcrypt-nodejs')
const database = require('./../database')
const moment = require('moment')
const router = require('express').Router()
const passport = require('./../config/login')

const userCheck = (request, response, next) => {
  if (request.user) {
    return next()
  } else {
    response.redirect('/login')
  }
}

router.get('/', (request, response) => {
  database.getAlbums((error, albums) => {
    if (error) {
      response.status(500).render('error', { error: error })
    } else {
      response.render('index', { albums: albums, user: request.user })
    }
  })
})

router.get('/albums/:albumID', (request, response) => {
  const albumID = request.params.albumID

  database.getAlbumsByID(albumID, (error, albums) => {
    if (error) {
      response.status(500).render('error', { error: error })
    } else {
      const album = albums[0]
      response.render('album', { album: album })
    }
  })
})

router.get('/signup', (request, response) => {
  response.render('signup')
})

router.post('/signup', (request, response) => {
  let cryptPword = bcrypt.hashSync(request.body.password)
  let date_joined = moment().format('MM-DD-YYYY')
  let certificate = [request.body.name, request.body.email, cryptPword, date_joined]

  database.createUser(certificate, (error) => {
    if (error) {
      response.render('signup', { user: null })
    } else {
      response.redirect('login')
    }
  })
})

router.get('/login', (request, response) => {
  let user = request.user ? request.user[0] : null
  response.render('login', {
    user: request.user
  })
})

router.post('/login',
  passport.authenticate('login', {
    successRedirect: '/profile',
    failureRedirect: '/login'
  }))

router.get('/logout', (request, response) => {
  request.session.destroy(() => {
    response.redirect('/')
  })
})

router.get('/profile', userCheck, (request, response) => {
  let { user } = request.session.passport
  database.getUserByID(user, (error, id) => {
    if (error) {
      response.status(500).render('error', { error: error })
    } else {
      let userID = id[0].id
      database.reviewsByUser(userID, (error, reviews) => {
        if (error) {
          response.status(500).render('error', { error: error })
        } else {
          response.render('profile', {
            user: request.user,
            reviews
          })
        }
      })
    }
  })
})

module.exports = router
