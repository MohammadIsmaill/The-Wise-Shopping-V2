const express = require('express')
const router = express.Router({ mergeParams: true })
const products = require('../controllers/products')
const catchAsync = require('../utils/catchAsync')
const multer = require('multer')
const { storage } = require('../Cloudinary')
const upload = multer({ storage })
const {
  validateProduct,
  isLoggedIn,
  isAuthor,
  isUserFound,
  isShopFound,
  isProductFound,
  verifyEmail,
} = require('../middleware')

router.get(
  '/new',
  isLoggedIn,
  catchAsync(isUserFound),
  catchAsync(verifyEmail),
  catchAsync(isAuthor),
  catchAsync(isShopFound),
  products.renderNewForm
)

router.post(
  '/',
  isLoggedIn,
  catchAsync(isUserFound),
  catchAsync(verifyEmail),
  catchAsync(isAuthor),
  catchAsync(isShopFound),
  validateProduct,
  upload.array('image'),
  catchAsync(products.createProduct)
)

router.get(
  '/:productsId/edit',
  isLoggedIn,
  catchAsync(isUserFound),
  catchAsync(verifyEmail),
  catchAsync(isAuthor),
  catchAsync(isShopFound),
  catchAsync(isProductFound),
  catchAsync(products.renderEditForm)
)
router
  .route('/:productsId')
  .put(
    isLoggedIn,
    catchAsync(isUserFound),
    catchAsync(verifyEmail),
    catchAsync(isAuthor),
    catchAsync(isShopFound),
    catchAsync(isProductFound),
    validateProduct,
    upload.array('image'),
    catchAsync(products.updateProduct)
  )
  .delete(
    isLoggedIn,
    catchAsync(isUserFound),
    catchAsync(verifyEmail),
    catchAsync(isAuthor),
    catchAsync(isShopFound),
    catchAsync(isProductFound),
    catchAsync(products.deleteProduct)
  )
module.exports = router
