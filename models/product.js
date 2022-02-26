const mongoose = require('mongoose')
const moment = require('moment')
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
    description: String,
    createdAt: {
      type: String,
      default: moment().format('MMMM Do YYYY, h:mm:ss a'),
    },
    lastUpdated: {
      type: String,
      default: moment().format('MMMM Do YYYY, h:mm:ss a'),
    },
    shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
  },
  opts
)

productSchema.pre('save', (next) => {
  this.lastUpdated = moment().format('MMMM Do YYYY, h:mm:ss a')
  this.count = this.count + 1
  next()
})
module.exports = mongoose.model('Product', productSchema)
