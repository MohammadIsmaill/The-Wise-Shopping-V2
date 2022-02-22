const mongoose = require('mongoose')
const { Schema } = mongoose
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new Schema({
  email: String,
  isValid: Boolean,
  uniqueString: String,
  shops: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
  ],
})

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', userSchema)
