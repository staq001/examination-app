const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')



// // GET METHODS
// SIGN UP
router.get('/signup', (req, res) => {
  res.render('signup')
})

// LOG IN
router.get('', (req, res) => {
  res.render('index')
})

// SERVE USER PROFILE
router.get('/users/me', auth, async (req, res) => {
  res.send(req.user)
})

// POST METHODS

// SIGN UP
router.post('/signup', async (req, res) => {
  const user = new User(req.body)
  // req.body -- JSON data coming from postman.
  try {
    await user.save()
    const token = await user.generateAuthToken()
    res.status(201).send({ user, token })
  } catch (e) {
    res.status(400).send(e)
  }
}) // works

// LOG IN PAGE
router.post('', async (req, res) => {
  const hash = req.body
  try {
    const user = await User.findByCredentials(hash.email, hash.password)
    const token = await user.generateAuthToken()
    res.send({ user, token })
  } catch (e) {
    res.status(400).send(e)
  }
})

// LOG OUT PAGE


// LOG OUT FROM ALL DEVICES.

// UPDATE 
router.patch('/users/me', async (req, res) => {
  const updates = Object.keys(req.body)
  // const allowedUpdates = ['firstName', 'surname', 'email', 'password']

  // const isValidOperation = updates.every((update) => {
  //   return allowedUpdates.includes(updates)
  // })

  // if (!isValidOperation)
  //   return res.status(400).send({ error: 'Invalid Updates!' })

  try {
    const _id = req.body.id
    const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })
    res.status(200).send(user)

  } catch (e) {
    res.status(400).send(e)
  }
})

router.delete('/users/me', async (req, res) => {
  try {
    const _id = req.body.id
    const user = await User.findByIdAndDelete({ _id: _id })
    res.status(200).send(user)
  } catch (e) {
    res.status(400).send(e)
  }
})





module.exports = router