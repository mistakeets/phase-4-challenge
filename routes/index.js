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

router.get('/signup', (request, response) => {
  response.render('signup')
})

router.get('/signin', (request, response) => {
  response.render('signin')
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

module.exports = router
