const User = require('../models/user')
const Product = require('../models/product')
const sendEmailValidation = require('../Nodemailer')
const { v4: uuidv4 } = require('uuid')

// const sendMail = require('../utils/sendMail')
module.exports.showProfile = async (req, res) => {
  const { usersId } = req.params
  const user = await User.findById(usersId).populate('shops')
  res.render('users/show', { user })
}
module.exports.home = async (req, res) => {
  const { search } = req.query
  let products
  if (search) {
    console.log('Searching')
    // products = await Product.find({ $text: { $search: search } })
    products = await Product.find({ name: { $regex: '.*' + search + '.*' } })
      .limit(5)
      .sort({ lastUpdated: -1 })
      .populate({
        path: 'shop',
        populate: {
          path: 'author',
        },
      })
  } else {
    products = await Product.find({})
      .sort({ lastUpdated: -1 })
      .populate({
        path: 'shop',
        populate: {
          path: 'author',
        },
      })
  }

  res.render('products/index', { products })
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
    const { email, username, password } = req.body
    const isValid = false
    const uniqueString = uuidv4()
    const user = new User({ email, username, isValid, uniqueString })
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
// module.exports.validateEmail = async(req,res)=>{
//   const {uniqueString} = req.params;
//   const user =await User.findOne({uniqueString})
//   if(user){
//     user.isValid = true
//     await user.save()
//     res.redirect('/products')

//   }else{

//   }
// }
module.exports.logout = (req, res) => {
  req.logout()
  res.redirect('/login')
}
