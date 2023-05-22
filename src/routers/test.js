const express = require('express')
const router = new express.Router()
const Test = require('../models/test')
const auth = require('../middleware/auth')




// // GET METHODS >

// provide all tests/examinations
router.get('/tests', auth, async (req, res) => {
  try {
    const test = await Test.find({ owner: req.user._id })
    res.status(200).send(test)
  } catch (e) {
    res.status(400).send(e)
  }
})

// provide a particular test by ID
router.get('/tests/:id', auth, async (req, res) => {
  try {
    const _id = req.params.id
    const test = await Test.findOne({ _id, owner: req.user._id })
    if (!test) {
      res.status(400).send({ error: 'Test doesn"t exist!' })
    }
    res.status(200).send(test)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.get('/tests/fth/:header/', auth, async (req, res) => {
  // get all tests by their header. 
  try {
    const header = req.params.header
    const test = await Test.find({ header, owner: req.user._id })
    res.status(200).send(test)
  } catch (e) {
    res.status(400).send(e)
  }
})




// // POST METHODS

// create a test
router.post('/tests/set', auth, async (req, res) => {
  const test = new Test({ ...req.body, owner: req.user._id })

  try {
    await test.save()
    res.status(201).send(test)
  } catch (e) {
    res.status(400).send(e)
  }
})


// // PATCH METHODS

router.patch('/tests/:id', auth, async (req, res) => {
  const _id = req.params.id
  const updates = Object.keys(req.body)
  const allowedUpdates = ['question', 'optionA', 'optionB', 'optionC', 'optionD', "answer"]

  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update)
  })

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Updates!" })
  }

  try {
    const test = await Test.findOne({ _id, owner: req.user._id })

    if (!test) {
      return res.status(404).send({ error: 'User not found!' })
    }

    updates.forEach(update => test[update] = req.body[update])
    await test.save()
    res.status(200).send(test)
  } catch (e) {
    res.status(400).send(e)
  }
})


// // DELETE METHODS

router.delete('/tests/:id', auth, async (req, res) => {
  try {
    const _id = req.params.id
    const test = await Test.findOneAndDelete({ _id, owner: req.user._id })

    if (!test) {
      return res.status(404).send({ error: 'Not found' })
    }
    res.status(200).send(test)
  } catch (e) {
    res.status(500).send(e)
  }
})


module.exports = router