const { shopSchema, productSchema } = require('./schemas')
const ExpressError = require('./utils/ExpressError')
const Shop = require('./models/shop')
const Product = require('./models/product')
const User = require('./models/user')
const { isValidObjectId } = require('mongoose')

module.exports.validateShop = (req, res, next) => {
  // console.log(req.files)
  const { error } = shopSchema.validate(req.body.shop)
  if (error) {
    const msg = error.details.map((e1) => e1.message).join(',')
    next(new ExpressError(msg, 400))
  } else {
    next()
  }
}
module.exports.validateProduct = (req, res, next) => {
  const { error } = productSchema.validate(req.body.product)
  if (error) {
    const msg = error.details.map((e1) => e1.message).join(',')
    next(new ExpressError(msg, 400))
  } else {
    next()
  }
}
module.exports.verifyEmail = async (req, res, next) => {
  const user = await User.findById(req.params.usersId)
  if (user.isValid === false) {
    req.flash('error', 'You should verify your email')
    return res.redirect('/verify')
  }
  next()
}

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl
    req.flash('error', 'You must be signed in!')
    return res.redirect('/login')
  }
  next()
}
module.exports.isAuthor = async (req, res, next) => {
  const { usersId } = req.params
  const user = await User.findById(usersId)
  if (!user.equals(req.user._id)) {
    next(new ExpressError('Forbidden', 403))
  }
  next()
}

module.exports.isUserFound = async (req, res, next) => {
  const { usersId } = req.params
  if (isValidObjectId(usersId)) {
    const user = await User.findById(usersId)
    if (user) return next()
  }
  next(new ExpressError('Page not found', 404))
}

module.exports.isProductFound = async (req, res, next) => {
  const { productsId } = req.params
  if (isValidObjectId(productsId)) {
    const product = await Product.findById(productsId)
    if (product) return next()
  }
  next(new ExpressError('Page not found', 404))
}
module.exports.isShopFound = async (req, res, next) => {
  const { shopsId } = req.params
  if (isValidObjectId(shopsId)) {
    const shop = await Shop.findById(shopsId)
    if (shop) return next()
  }
  next(new ExpressError('Page not found', 404))
}
