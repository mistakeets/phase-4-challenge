const router = require('express').Router()
const database = require('./../database')

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
  let user = database.createUser(request.body.email, request.body.password, request.body.name)
  user.then((data) => {
    response.render('/signin')
  })
})

router.get('/signin', (request, response) => {
  response.render('signin')
})

router.post('/signin', (request, response) => {
  passport.authenticate('signin', {
    successRedirect: '/users',
    failureRedirect: '/signin'
  })
})

router.get('/users', (request, response) => {
  response.render('users')
})

module.exports = router
