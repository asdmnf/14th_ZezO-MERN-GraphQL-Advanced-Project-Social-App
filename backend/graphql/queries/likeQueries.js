const likeModel = require("../../models/likeModel")
const { getAllDocuments } = require("../../utils/handlersFactory")


const likeQueries = {
  // get all likes
  getAllLikes: async (parent, args, context, info) => {
    return await getAllDocuments(likeModel, args, context)
  }
}

module.exports = likeQueries