const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')



// // GET METHODS
// SIGN UP
router.get('users/signup', (req, res) => {
  res.render('signup')
})

// LOG IN
router.get('/', (req, res) => {
  res.render('index')
})

// SERVE USER PROFILE
router.get('/users/me', auth, async (req, res) => {
  res.send(req.user)
})

// POST METHODS

// SIGN UP
router.post('/users/signup', async (req, res) => {
  const user = new User(req.body)
  // req.body -- JSON data coming from postman.
  try {
    await user.save()
    const token = await user.generateAuthToken()
    res.status(201).send({ user, token })
  } catch (e) {
    res.status(400).send(e)
  }
})

// LOG IN PAGE
router.post('/', async (req, res) => {
  const hash = req.body
  try {
    const user = await User.findByCredentials(hash.email, hash.password)
    const token = await user.generateAuthToken()
    res.send({ user, token })
  } catch (e) {
    res.status(400).send(e)
  }
}) // works

// LOG OUT PAGE

router.post('/users/logout', auth, async (req, res) => {
  try {
    const user = req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
      // deleting that particular token
    })

    await req.user.save()
    res.status(200).send(req.user)
  } catch (e) {
    res.status(400).send(e)
  }
}) // works

// LOG OUT FROM ALL DEVICES.

router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()
    res.status(200).send(req.user)
  } catch (e) {
    res.status(400).send(e)
  }
})
// __________________________________________________________________________

// UPDATE 
router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  // console.log(updates)
  const allowedUpdates = ['firstName', 'surname', 'email', 'password']

  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update)
  })

  if (!isValidOperation)
    return res.status(400).send({ error: 'Invalid Updates!' })

  try {
    // const _id = req.body.id
    // const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })
    updates.forEach(update => req.user[update] = req.body[update])
    await req.user.save()
    res.status(200).send(req.user)

  } catch (e) {
    res.status(400).send(e)
  }
})

// DELETE USER
router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.remove()
    res.send(req.user)
  } catch (e) {
    res.status(500).send(e)
  }
})





module.exports = router