const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken")

// verify token and user authorization
const getUserByToken = async (req, ...roles) => {
    // 1- get token from req.header.authorization
    let token
    if (req.headers?.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1]
    }
  
    if (!token) {
      return null
    }
  
    // 2- verify token with jwt secret key
    const verifiedToken = jwt.verify(token, process.env.JWT_SCRET_KET)
  
    // 3- get document by verified token
    const document = await userModel.findById(verifiedToken.userId)
  
    if (!document) {
      throw new Error(`your user account is not exists any more please signup again`)
    }

    // 4- check user role
    if (roles.length && !roles.includes(document.role)) {
      throw new Error(`you are not allowed to perform this action`)
    }
  
    return document
}

module.exports = getUserByToken