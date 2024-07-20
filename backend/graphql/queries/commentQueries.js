const commentModel = require("../../models/commentModel")
const { getAllDocuments, getOneDocument } = require("../../utils/handlersFactory")


const commentQueries = {
  // get all comments
  getAllComments: async (parent, args, context, info) => {
    return await getAllDocuments(commentModel, args, context, {post: args.postId})
  },
  // get one comment
  getOneComment: async (parent, args, context, info) => {
    return await getOneDocument(commentModel, args, context)
  }
}

module.exports = commentQueries