const router = require('express').Router()
const database = require('./../database')
const bcrypt = require('bcrypt-nodejs')
const moment = require('moment')
const passport = require('./../config/auth')

router.get('/', (request, response) => {
  database.getAlbums((error, albums) => {
    if (error) {
      response.status(500).render('error', { error: error })
    } else {
      response.render('index', { albums: albums })
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
  response.render('login', { user: user })
})

router.post('/login',
  passport.authenticate('login', {
    successRedirect: '/users',
    failureRedirect: '/login'
  }))

router.get('/users', (request, response) => {
  response.render('users')
})

module.exports = router
