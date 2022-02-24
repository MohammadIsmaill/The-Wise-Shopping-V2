const express = require('express')
const router = express.Router()
const passport = require('passport')
const users = require('../controllers/users')
const catchAsync = require('../utils/catchAsync')
const User = require('../models/user')
const { isLoggedIn } = require('../middleware')

router.get('/', (req, res) => {
  res.redirect('/login')
})

router.get('/verify/:uniqueString', isLoggedIn, catchAsync(users.validateEmail))

router.get('/verify', isLoggedIn, catchAsync(users.showEmailVerification))

router.get('/products', catchAsync(users.home))

router.get('/users/:usersId', users.showProfile)

router
  .route('/login')
  .get(users.renderLoginForm)
  .post(
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: true,
    }),
    users.login
  )
router
  .route('/register')
  .get(users.showRegisterForm)
  .post(catchAsync(users.register))

router.get('/logout', users.logout)

module.exports = router
