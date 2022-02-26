const mongoose = require('mongoose')
const { Schema } = mongoose
const passportLocalMongoose = require('passport-local-mongoose')
const ImageSchema = new Schema({
  url: String,
  filename: String,
})
ImageSchema.virtual('thumbnail').get(() => {
  return this.url.replace('/upload', '/upload/w_200')
})
const opts = { toJson: { virtuals: true } }

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, 'Email cannot be blank'],
    },
    fullname: {
      type: String,
    },
    about: {
      type: String,
    },
    images: {
      type: [ImageSchema],
    },
    isValid: {
      type: Boolean,
      required: [true, 'isValid cannot be blank'],
    },
    uniqueString: {
      type: String,
      required: [true, 'uniqueString cannot be blank'],
      unique: true,
    },
    profilePicture: [ImageSchema],
    shops: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Shop',
      },
    ],
  },
  opts
)

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', userSchema)
