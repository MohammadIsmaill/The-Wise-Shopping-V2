const mongoose = require('mongoose')
const { Schema } = mongoose
const Product = require('./product')
const User = require('./user')

const ImageSchema = new Schema({
  url: String,
  filename: String,
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
      type: Date,
      default: Date.now,
    },
    lastUpdated: {
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
  this.lastUpdated = Date.now()
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
