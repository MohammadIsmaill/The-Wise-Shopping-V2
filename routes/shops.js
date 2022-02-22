const express = require('express')
const router = express.Router({ mergeParams: true })
const shops = require('../controllers/shops')
const catchAsync = require('../utils/catchAsync')
const multer = require('multer')
const { storage } = require('../Cloudinary')
const upload = multer({ storage })
const {
  validateShop,
  isLoggedIn,
  isAuthor,
  isUserFound,
  isShopFound,
  verifyEmail,
} = require('../middleware')

router
  .route('/')
  .get(catchAsync(isUserFound), shops.index)
  .post(
    isLoggedIn,
    catchAsync(isUserFound),
    catchAsync(verifyEmail),
    catchAsync(isAuthor),
    validateShop,
    upload.array('image'),
    catchAsync(shops.createShop)
  )

router.get(
  '/new',
  isLoggedIn,
  catchAsync(isUserFound),
  catchAsync(verifyEmail),
  catchAsync(isAuthor),
  shops.renderNewForm
)

router
  .route('/:shopsId')
  .get(
    catchAsync(isUserFound),
    catchAsync(verifyEmail),
    catchAsync(isShopFound),
    catchAsync(shops.showShop)
  )
  .put(
    isLoggedIn,
    catchAsync(isUserFound),
    catchAsync(verifyEmail),
    catchAsync(isAuthor),
    catchAsync(isShopFound),
    validateShop,
    upload.array('image'),
    catchAsync(shops.updateShop)
  )
  .delete(
    isLoggedIn,
    catchAsync(isUserFound),
    catchAsync(verifyEmail),
    catchAsync(isAuthor),
    catchAsync(isShopFound),
    catchAsync(shops.deleteShop)
  )
router.get(
  '/:shopsId/edit',
  isLoggedIn,
  catchAsync(isUserFound),
  catchAsync(verifyEmail),
  catchAsync(isAuthor),
  catchAsync(isShopFound),
  catchAsync(shops.renderEditForm)
)

module.exports = router
