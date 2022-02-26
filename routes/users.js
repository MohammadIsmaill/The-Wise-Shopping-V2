const express = require('express')
const router = express.Router()
const passport = require('passport')
const users = require('../controllers/users')
const catchAsync = require('../utils/catchAsync')
const multer = require('multer')
const { storage } = require('../Cloudinary')
const upload = multer({ storage })
const {
  isLoggedIn,
  canRegister,
  isAuthor,
  isUserFound,
  verifyEmail,
  uniqueEmail,
} = require('../middleware')

router.get('/', (req, res) => {
  res.redirect('/login')
})

router.get('/verify/:uniqueString', isLoggedIn, catchAsync(users.validateEmail))

router.get('/verify', isLoggedIn, catchAsync(users.showEmailVerification))

router.get('/products', catchAsync(users.home))

router.get('/users/:usersId', users.showProfile)
router.get(
  '/users/:usersId/edit',
  isLoggedIn,
  catchAsync(isUserFound),
  catchAsync(verifyEmail),
  catchAsync(isAuthor),
  users.renderEditForm
)
router.put(
  '/users/:usersId/edit',
  isLoggedIn,
  catchAsync(isUserFound),
  catchAsync(verifyEmail),
  catchAsync(isAuthor),
  upload.array('image'),
  users.editUser
)
router
  .route('/login')
  .get(canRegister, users.renderLoginForm)
  .post(
    canRegister,
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: true,
    }),
    users.login
  )
router
  .route('/register')
  .get(canRegister, users.showRegisterForm)
  .post(canRegister, uniqueEmail, catchAsync(users.register))

router.get('/logout', users.logout)

module.exports = router
