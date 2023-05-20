const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '') // removing string 'bearer' in postman
    // fetching token from postman

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // console.log(token) // token from postman
    // console.log(decoded) // id of the user

    const user = await User.findOne({ _id: decoded._id, "tokens.token": token })

    // console.log(user) // -------------- error coming from here.
    if (!user) {
      throw new Error()
    }

    req.token = token
    req.user = user
    // giving the router access to the user and the token that we fetched from the database/recent token we sent.

    next()
  } catch (e) {
    res.status(401).send({ error: "Please authenticate!" })
  }
}

module.exports = auth

// middleware function