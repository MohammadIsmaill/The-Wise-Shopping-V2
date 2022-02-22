const mongoose = require('mongoose')
const { Schema } = mongoose

const ImageSchema = new Schema({
  url: String,
  filename: String,
})
ImageSchema.virtual('thumbnail').get(() => {
  return this.url.replace('/upload', '/upload/w_200')
})
const opts = { toJson: { virtuals: true } }

const productSchema = new Schema(
  {
    name: String,
    price: String,
    images: [ImageSchema],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
  },
  opts
)
productSchema.index({ name: 'text' })

productSchema.pre('save', (next) => {
  this.lastUpdated = Date.now()
  next()
})
module.exports = mongoose.model('Product', productSchema)
