const User = require('../models/user')
const Shop = require('../models/shop')
const mapBoxToken = process.env.MAPBOX_TOKEN
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })

const { cloudinary } = require('../Cloudinary')
module.exports.index = async (req, res) => {
  const user = await User.findById(req.params.usersId).populate('shops')
  res.render('shops/index', { user })
}

module.exports.renderNewForm = (req, res) => {
  const { usersId } = req.params
  res.render('shops/new', { usersId })
}
module.exports.createShop = async (req, res) => {
  const { usersId } = req.params
  const geometry = {
    type: 'Point',
    coordinates: [req.body.lng, req.body.lat],
  }
  const shop = new Shop(req.body.shop)
  const user = await User.findById(usersId)
  shop.geometry = geometry
  shop.images = req.files.map((f) => ({ url: f.path, filename: f.filename }))
  shop.author = user._id
  user.shops.push(shop)
  await shop.save()
  await user.save()
  req.flash('success', 'Shop created successfully!')
  res.redirect(`/users/${usersId}/shops/${shop.id}`)
  console.log(req.body)
}
module.exports.showShop = async (req, res) => {
  const { shopsId, usersId } = req.params
  const shop = await Shop.findById(shopsId).populate('products')
  const user = await User.findById(usersId)
  res.render('shops/show', { shop, user })
}

module.exports.renderEditForm = async (req, res) => {
  const { shopsId, usersId } = req.params
  const shop = await Shop.findById(shopsId)
  res.render('shops/edit', { shop, usersId })
}

module.exports.updateShop = async (req, res) => {
  const { shopsId, usersId } = req.params
  const shop = await Shop.findByIdAndUpdate(shopsId, { ...req.body.shop })
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }))
  shop.images.push(...imgs)
  await shop.save()
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename)
    }
    await shop.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    })
  }

  req.flash('success', 'Shop updated successfully')
  res.redirect(`/users/${usersId}/shops/${shop.id}`)
}

module.exports.deleteShop = async (req, res) => {
  const { shopsId, usersId } = req.params
  await User.findByIdAndUpdate(usersId, { $pull: { shops: shopsId } })
  const shop = await Shop.findById(shopsId)
  for (let image of shop.images) {
    await cloudinary.uploader.destroy(image.filename)
  }
  await Shop.findByIdAndDelete(shopsId)
  req.flash('success', 'Successfully deleted shop!')
  res.redirect(`/users/${usersId}`)
}
