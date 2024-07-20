const jwt = require('jsonwebtoken')

const generateToken = (document) => {
  return jwt.sign({
    userId: document._id,
    name: document.name,
    email: document.email,
  }, process.env.JWT_SCRET_KET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })
}

module.exports = generateToken