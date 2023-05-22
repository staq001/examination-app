const express = require('express')
require('./db/mongoose')
const path = require('path')
const hbs = require('hbs')
const userRouter = require('./routers/user.js')
const testRouter = require('./routers/test.js')


const app = express()
const port = process.env.PORT || 3000

// configuring the path for express config
const publicDirectoryPath = path.join(__dirname, "../public")

// configuring directory --> for hbs
const viewsPath = path.join(__dirname, '../template/views')
const partialsPath = path.join(__dirname, '../template/partials')

app.set('view engine', 'hbs')

// configuring views location for handlebars
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// setup directory to serve
app.use(express.static(publicDirectoryPath))

app.use(express.json())
app.use(userRouter)
app.use(testRouter)

app.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})