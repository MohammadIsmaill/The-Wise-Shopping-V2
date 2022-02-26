const User = require('../models/user')
const Product = require('../models/product')
const sendEmailValidation = require('../TwilioSendGrid')
const { v4: uuidv4 } = require('uuid')
const { shopSchema } = require('../schemas')
const { cloudinary } = require('../Cloudinary')

async function paginateProducts(pageNumber, nPerPage) {
  await Product.find()
    .sort({})
    .skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0)
    .limit(nPerPage)
}

module.exports.showProfile = async (req, res) => {
  const { usersId } = req.params
  const user = await User.findById(usersId).populate('shops')
  res.render('users/show', { user })
}
module.exports.home = async (req, res) => {
  let { search, page } = req.query
  console.log(page)
  page = parseInt(page)
  let totalPaginatedPages
  let nPerPage = 10
  let products
  let totalProducts = await Product.find().count()
  if (search) {
    products = await Product.find({ name: { $regex: '.*' + search + '.*' } })
      .sort({ lastUpdatedDateFormat: -1 })
      .skip(page > 1 ? page * nPerPage : 0)
      .limit(nPerPage)
      .populate({
        path: 'shop',
        populate: {
          path: 'author',
        },
      })

    totalPaginatedPages = (totalProducts + nPerPage) / nPerPage
  } else {
    products = await Product.find()
      .sort({ lastUpdatedDateFormat: -1 })
      .skip(page > 1 ? (page - 1) * nPerPage : 0)
      .limit(nPerPage)
      .populate({
        path: 'shop',
        populate: {
          path: 'author',
        },
      })
    totalPaginatedPages = ((totalProducts + nPerPage) / nPerPage) | 0
    // console.log(totalPaginatedPages)
    console.log(page)
  }
  res.render('products/index', { products, page, totalPaginatedPages })
}

module.exports.renderEditForm = async (req, res) => {
  const { usersId } = req.params
  const user = await User.findById(usersId)
  console.log(user.images)
  res.render('users/edit', { usersId, user })
}
module.exports.editUser = async (req, res) => {
  const { fullname, about } = req.body
  const { usersId } = req.params
  const user = await User.findByIdAndUpdate(usersId, { fullname, about })
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }))
  user.images.push(...imgs)
  await user.save()
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename)
    }
    await user.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    })
  }
  res.redirect(`/users/${usersId}`)
}
module.exports.renderLoginForm = (req, res) => {
  res.render('users/login')
}

module.exports.login = async (req, res) => {
  const user = await User.findById(req.user.id)
  if (user.isValid) {
    const redirectUrl = req.session.returnTo || `/products`
    delete req.session.returnTo
    req.flash('success', 'Welcome back!')
    res.redirect(redirectUrl)
  } else {
    res.redirect('/verify')
  }
}

module.exports.showRegisterForm = (req, res) => {
  res.render('users/register')
}
module.exports.register = async (req, res) => {
  try {
    const { email, username, password, fullname } = req.body
    const isValid = false
    const uniqueString = uuidv4()
    const user = new User({ email, username, isValid, uniqueString, fullname })
    const registeredUser = await User.register(user, password)
    sendEmailValidation(email, uniqueString)
    req.login(registeredUser, (err) => {
      if (err) return next(err)
      // res.redirect('/products')
      res.redirect('/verify')
    })
  } catch (e) {
    res.redirect('register')
  }
}
module.exports.validateEmail = async (req, res) => {
  const { uniqueString } = req.params
  const user = await User.findById(req.user.id)
  if (user.uniqueString === uniqueString) {
    user.isValid = true
    await user.save()
    res.redirect('/products')
  } else {
    res.redirect('/verify')
  }
}
module.exports.showEmailVerification = async (req, res) => {
  const user = await User.findById(req.user.id)
  if (user.isValid) {
    return res.redirect('/products')
  }
  res.send('Please verify email')
}

module.exports.logout = (req, res) => {
  req.logout()
  res.redirect('/login')
}
