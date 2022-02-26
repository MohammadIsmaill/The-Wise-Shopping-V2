const mongoose = require('mongoose')
const moment = require('moment')
const { Schema } = mongoose
const Product = require('./product')

const ImageSchema = new Schema({
  url: {
    type: String,
  },
  filename: {
    type: String,
  },
})
ImageSchema.virtual('thumbnail').get(() => {
  return this.url.replace('/upload', '/upload/w_200')
})
const opts = { toJson: { virtuals: true } }
const shopSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name cannot be blank'],
    },
    phone: {
      type: String,
      required: [true, 'Phone cannot be blank'],
    },
    location: {
      type: String,
      required: [true, 'Phone cannot be blank'],
    },
    description: {
      type: String,
      required: [true, 'Description cannot be blank'],
    },
    images: [ImageSchema],

    geometry: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    createdAt: {
      type: String,
      default: moment().format('MMMM Do YYYY, h:mm:ss a'),
    },
    lastUpdated: {
      type: String,
      default: moment().format('MMMM Do YYYY, h:mm:ss a'),
    },
    lastUpdatedDateFormat: {
      type: Date,
      default: Date.now,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  opts
)
shopSchema.pre('save', (next) => {
  this.lastUpdated = moment().format('MMMM Do YYYY, h:mm:ss a')
  this.lastUpdatedDateFormat = Date.now
  next()
})
shopSchema.post('findOneAndDelete', async (doc) => {
  if (doc) {
    await Product.deleteMany({
      _id: {
        $in: doc.products,
      },
    })
  }
})
module.exports = mongoose.model('Shop', shopSchema)
