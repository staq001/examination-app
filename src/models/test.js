const mongoose = require('mongoose')
const User = require('./user')



const testSchema = new mongoose.Schema({
  header: {
    type: String,
    required: true,
    trim: true,
  },
  question: [{
    text: {
      type: String,
      required: true,
      trim: true
    },
    options: [{
      optionA: {
        type: String,
        required: true,
        trim: true
      },
      optionB: {
        type: String,
        required: true,
        trim: true
      },
      optionC: {
        type: String,
        required: true,
        trim: true
      },
      optionD: {
        type: String,
        required: true,
        trim: true
      }
    }],
    answer: {
      type: String || Number,
      required: true,
      trim: true
    }
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId, // id of the user goes here
    required: true,
    ref: 'User' // this is the model name like it is typed in user model
  }
}, {
  timestamps: true
})

const Test = mongoose.model('Test', testSchema)


module.exports = Test