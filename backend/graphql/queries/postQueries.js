const postModel = require("../../models/postModel")
const { getAllDocuments, getOneDocument } = require("../../utils/handlersFactory")

const postQueries = {
  // get all posts
  getAllPosts: async (parent, args, context, info) => {
    return getAllDocuments(postModel, args, context)
  },
  // get one post
  getOnePost: async (parent, args, context, info) => {
    return getOneDocument(postModel, args, context)
  }
}

module.exports = postQueries