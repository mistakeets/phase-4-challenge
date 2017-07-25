const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const app = express()
const routes = require('./routes')
const passport = require('./config/auth')
const session = require('express-session')


require('ejs')
app.set('view engine', 'ejs');

app.use(express.static('public'))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/', routes)

app.use(session({ secret: 'notsosecret', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())

app.get('/signup', (request, response) => {
  response.render('signup')
})

app.post('/signup', (request, response) => {
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

app.get('/login', (request, response) => {
  let user = request.user ? request.user[0] : null
  response.render('login', {
    user: request.user
  })
})

app.post('/login',
  passport.authenticate('login', {
    successRedirect: '/users',
    failureRedirect: '/login'
  }))

app.get('/logout', (request, response) => {
  request.session.destroy(() => {
    response.redirect('/')
  })
})

app.get('/users', (request, response) => {
  response.render('users', {
    user: request.user
  })
})



app.use((request, response) => {
  response.status(404).render('not_found')
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}...`)
})
