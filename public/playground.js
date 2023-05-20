const bcrypt = require('bcryptjs')

const myfunction = async () => {
  const password = 'West123'
  const hashedPassword = await bcrypt.hash(password, 8)

  console.log(hashedPassword)

  const isMatch = await bcrypt.compare(password, hashedPassword)
  console.log(isMatch)
}


myfunction()