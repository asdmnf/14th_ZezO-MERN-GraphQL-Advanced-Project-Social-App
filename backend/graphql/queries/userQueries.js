const userModel = require("../../models/userModel")
const ApiFeatures = require("../../utils/ApiFeatures")
const { getAllDocuments, getOneDocument } = require("../../utils/handlersFactory")


const userQueries = {
  // get all users
  getAllUsers: async (parent, args, context, info) => {
    return getAllDocuments(userModel, args, context)
  },
  // get one user
  getOneUser: async (parent, args, context, info) => {
    return getOneDocument(userModel, args, context)
  },
  // get me
  getMe: async (parent, args, context, info) => {
      const user = context.user
      const token = context.req.headers.authorization.split(' ')[1]
      return {
        user,
        token
      }
  }
}

module.exports = userQueries