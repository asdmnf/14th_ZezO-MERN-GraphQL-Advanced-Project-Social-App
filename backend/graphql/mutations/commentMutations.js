const commentModel = require("../../models/commentModel")
const postModel = require("../../models/postModel")
const { updateOneDocument, deleteOneDocument } = require("../../utils/handlersFactory")
const CustomGQLError = require("../errors/CustomGQLError")


const commentMutations = {
  // create comment
  createComment: async (parent, {postId, comment}, context, info) => {
    // get post to check if post exists
    const post = await postModel.findById(postId)

    // check if post exists
    if (!post) {
      throw new CustomGQLError("Post not found", "POST_NOT_FOUND")
    }
    
    // create comment
    const commentDocument = await commentModel.create({
      user: context.user._id,
      post: postId,
      comment
    })

    // return comment
    return commentDocument
  },
  // update comment
  updateComment: async (parent, args, context, info) => {
    return updateOneDocument(commentModel, args, context)
  },
  // delete comment
  deleteComment: async (parent, args, context, info) => {
    return deleteOneDocument(commentModel, args, context)
  }
}

module.exports = commentMutations