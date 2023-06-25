const express = require('express')
require('./db/mongoose')
const path = require('path')
const userRouter = require('./routers/user.js')
const testRouter = require('./routers/test.js')
const { access, constants } = require('fs')


const app = express()
const port = process.env.PORT || 3000

// configuring the path for express config
const publicDirectoryPath = path.join(__dirname, "../public")

// set-up public directory to serve
app.use(express.static(publicDirectoryPath))


// removing the .html extensions.
const removeExtension = () => {
  const extensions = ['index', 'continue', 'signup']
  extensions.forEach(element => {
    app.get(`/${element}`, (req, res) => {
      res.sendFile(path.join(publicDirectoryPath, 'html', `${element}.html`))
    })
  });
}

removeExtension()

// app.get('/index', (req, res) => {
//   res.sendFile(path.join(publicDirectoryPath, 'index.html'))
// })

app.use(express.json())
app.use(userRouter)
app.use(testRouter)

app.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})