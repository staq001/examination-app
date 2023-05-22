const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Test = require('./test')
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
    trim: true,
    minlength: 7,
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('password contains the word "password"')
      }
    }
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
}, {
  timestamps: true
})

// creating a virtual field/object
userSchema.virtual('tests', {
  ref: 'Test',
  localField: '_id',
  foreignField: 'owner'
})

userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject() // mongoose function

  // delete userObject.firstName
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

userSchema.statics.findByCredentials = async function findByCredentials(email, passwordd) {
  const user = await User.findOne({ email })
  if (!user) {
    throw new Error('Unable to log in')
  }

  const isMatch = await bcrypt.compare(passwordd, user.password)
  // console.log(isMatch)
  if (!isMatch) {
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
})


userSchema.post("remove", async function (next) {
  const user = this
  await Test.deleteMany({ owner: user._id })
  // next()
})



const User = mongoose.model('User', userSchema)
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

module.exports = User