const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// const auth = require('../middleware/auth')


const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  surname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid email')
      }
    }
  },
  password: {
    type: String,
    required: true,
    lowercase: true,
    minlength: [7, `value must have a minimum length of`],
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('password contains the word "password"')
      }
    },
    trim: true
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  avatar: {
    type: Buffer
  }
})


userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject() // mongoose function

  delete userObject.password
  delete userObject.tokens
  delete userObject.avatar

  return userObject
}


userSchema.methods.generateAuthToken = async function () {
  const user = this

  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
  user.tokens = user.tokens.concat({ token })
  await user.save()
  return token
}

userSchema.statics.findByCredentials = async function findByCredentials(email, password) {
  const user = await User.findOne({ email })
  if (!user) {
    throw new Error('Unable to log in')
  }
  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    throw new Error('Unable to log in')
  }
  return user
}

userSchema.pre('save', async function (next) {
  const user = this

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
}) // works



// const me = new User({
//   firstName: 'Omotola',
//   surname: "Oyeneyin",
//   email: 'dame.hushie@gmail.com',
//   password: 'runmedownNN555'
// })

// me.save().then(() => {
//   console.log(me)
// }).catch((error) => {
//   'Error!', console.log(error)
// })
const User = mongoose.model('User', userSchema)

module.exports = User