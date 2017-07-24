const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const app = express()
const routes = require('./routes')
const passport = require('./config/auth')
const session = require('express-session')
const User = require('./model/user')

require('ejs')
app.set('view engine', 'ejs');

app.use(express.static('public'))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(session({ secret: 'notsosecret', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())

app.use('/', routes)

app.use((request, response) => {
  response.status(404).render('not_found')
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}...`)
})
