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
      database.recentReviews(3, (error, reviews) => {
        if (error) {
          response.status(500).render('error', { error: error })
        } else {
          response.render('index', { albums: albums, reviews: reviews, user: request.user })
        }
      })
    }
  })
})

router.get('/albums/:albumID', userCheck, (request, response) => {
  const albumID = request.params.albumID

  database.getAlbumsByID(albumID, (error, albums) => {
    if (error) {
      response.status(500).render('error', { error: error })
    } else {
      const album = albums[0]
      database.reviewsByAlbum(albumID, (error, reviews) => {
        if (error) {
          response.status(500).render('error', { error: error })
        } else {
          response.render('album', { album: album, reviews: reviews, user: request.user })
        }
      })
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

router.get('/newReview/:albumID', userCheck, (request, response) => {
  const albumID = request.params.albumID
  database.getAlbumsByID(albumID, (error, albums) => {
    if (error) {
      response.status(500).render('error', { error: error })
    } else {
      const album = albums[0]
      response.render('new_review', { album: album, user: request.user })
    }
  })
})

router.post('/newReview/:albumID', userCheck, (request, response) => {
  const albumID = request.params.albumID
  const userID = request.user
  const reviewContent = request.body.content

  if (review_content.length === 0) {
    response.status(400).render('error', {
      error: new Error(
        "You can either type the review or pay me to write one for you.")
    })
  } else {
    let reviewDate = moment().format('MM-DD-YYYY')
    database.addReview(albumID, userID, reviewContent, reviewDate, (error, review) => {
      if (error) {
        response.status(500).render('error', { error: error })
      } else {
        response.redirect(`albums/${albumID}`)
      }
    })
  }
})

module.exports = router
