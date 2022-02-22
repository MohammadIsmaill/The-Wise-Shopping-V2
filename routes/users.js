const express = require('express')
const router = express.Router()
const passport = require('passport')
const users = require('../controllers/users')
const catchAsync = require('../utils/catchAsync')
const User = require('../models/user')
const {
  validateProduct,
  isLoggedIn,
  isAuthor,
  isUserFound,
  isShopFound,
  isProductFound,
  verifyEmail,
} = require('../middleware')

router.get('/', (req, res) => {
  res.redirect('/login')
})
router.get('/verify/:uniqueString', isLoggedIn, async (req, res) => {
  const { uniqueString } = req.params
  // const user = await User.findOne({ uniqueString })
  const user = await User.findById(req.user.id)
  if (user.uniqueString === uniqueString) {
    user.isValid = true
    await user.save()
    res.redirect('/products')
  } else {
    res.redirect('/verify')
  }
})
router.get('/verify', isLoggedIn, async (req, res) => {
  const user = await User.findById(req.user.id)
  if (user.isValid) {
    return res.redirect('/products')
  }
  res.send('Please verify email')
})
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
