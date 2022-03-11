const session = require('express-session')
const usePassport = require('./config/passport')
const passport = require('passport')
const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const bcrypt = require('bcryptjs')
const app = express()
const PORT = 3000
const db = require('./models')
const user = require('./models/user')
const User = db.User
const Custom = db.Custom
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
usePassport(app)
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  next()
})
const authenticator = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/users/login')
}

app.get('/customs/new', authenticator, (req, res) => {
  return res.render('new')
})
app.get('/customs/:id', authenticator, (req, res) => {
  const id = req.params.id
  return Custom.findByPk(id)
    .then(custom => res.render('detail', { custom: custom.toJSON() }))
    .catch(error => console.log(error))
})

app.post('/customs', authenticator, (req, res) => {
  const { name, address, password, confirmPassword } = req.body
  // console.log('create-res.locals.user: ', res.locals.user)
  const localUser = res.locals.user
  // console.log('a.id:  ', a.id)
  Custom.findOne({
    where: {
      name, UserId: localUser.id
} }).then(user => {
    if (user) {
      console.log('Custom already exists')
      return res.render('new', {
        name,
        address,
        password,
        confirmPassword
      })
    }
    return Custom.create({
      name,
      address,
      password,
      UserId: localUser.id
    })
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
  })
})
app.get('/customs/:id/edit', authenticator, (req, res) => {
  const UserId = req.user.id
  const id = req.params.id

  return Custom.findOne({ where: { id, UserId } })
    .then(custom => res.render('edit', { custom: custom.get() }))
    .catch(error => console.log(error))
})

app.put('/customs/:id', authenticator, (req, res) => {
  const UserId = req.user.id
  const id = req.params.id
  const { name, address, password } = req.body

  return Custom.findOne({ where: { id, UserId } })
    .then(custom => {
      custom.name = name
      custom.address = address
      custom.password = password
      return custom.save()
    })
    .then(() => res.redirect(`/customs/${id}`))
    .catch(error => console.log(error))
})
app.delete('/customs/:id', authenticator, (req, res) => {
  const UserId = req.user.id
  const id = req.params.id

  return Custom.findOne({ where: { id, UserId } })
    .then(custom => custom.destroy())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})
app.get('/users/login', (req, res) => {
  res.render('login')
})
app.post('/users/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

app.get('/users/register', (req, res) => {
  res.render('register')
})

app.post('/users/register', (req, res) => {
  const { name, address, password, confirmPassword } = req.body
  User.findOne({ where: { name } }).then(user => {
    if (user) {
      console.log('User already exists')
      return res.render('register', {
        name,
        address,
        password,
        confirmPassword
      })
    }
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => User.create({
        name,
        address,
        password: hash
      }))
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
  })
})

app.get('/users/logout', (req, res) => {
  req.logout()
  res.redirect('/users/login')
})
app.get('/', authenticator, (req, res) => {
  const UserId = req.user.id
  return Custom.findAll({
    where: { UserId },
    raw: true,
    nest: true
  })
    .then((customs) => { return res.render('index', { customs: customs }) })
    .catch((error) => { return res.status(422).json(error) })
})
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})