const { cloudinary } = require('../Cloudinary')
const Product = require('../models/product')
const Shop = require('../models/shop')

module.exports.renderNewForm = (req, res) => {
  const { shopsId, usersId } = req.params
  res.render('products/new', { shopsId, usersId })
}

module.exports.createProduct = async (req, res) => {
  const { shopsId, usersId } = req.params
  const product = new Product(req.body.product)
  const shop = await Shop.findById(shopsId)
  product.shop = shop
  product.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }))

  shop.products.push(product)
  await product.save()
  await shop.save()
  req.flash('success', 'Product created successfully!')
  res.redirect(`/users/${usersId}/shops/${shopsId}`)
}

module.exports.renderEditForm = async (req, res) => {
  const { usersId, shopsId, productsId } = req.params
  const product = await Product.findById(productsId)
  res.render('products/edit', { usersId, shopsId, product })
}

module.exports.updateProduct = async (req, res) => {
  const { usersId, shopsId, productsId } = req.params
  const product = await Product.findByIdAndUpdate(productsId, req.body.product)
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }))
  product.images.push(...imgs)
  await product.save()
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename)
    }
    await product.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    })
  }

  req.flash('success', 'Product successfully updated!')
  res.redirect(`/users/${usersId}/shops/${shopsId}`)
}

module.exports.deleteProduct = async (req, res) => {
  const { usersId, shopsId, productsId } = req.params
  await Shop.findByIdAndUpdate(shopsId, {
    $pull: { products: productsId },
  })
  const product = await Product.findById(productsId)
  for (let image of product.images) {
    await cloudinary.uploader.destroy(image.filename)
  }
  await Product.findByIdAndDelete(productsId)
  req.flash('success', 'Product deleted successfully')
  res.redirect(`/users/${usersId}/shops/${shopsId}`)
}
