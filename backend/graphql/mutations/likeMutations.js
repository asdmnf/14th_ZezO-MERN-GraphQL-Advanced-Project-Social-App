const likeModel = require("../../models/likeModel")
const postModel = require("../../models/postModel")


const likeMutations = {
  // toggle like
  toggleLike: async (parent, { postId }, context, info) => {
    // get post to check if post exists
    const post = await postModel.findById(postId)

    // check if post exists
    if (!post) {
      throw new CustomGQLError("Post not found", "POST_NOT_FOUND")
    }

    // check if user already liked post
    const alreadyLiked = await likeModel.findOne({
      user: context.user._id,
      post: postId
    })

    if (alreadyLiked) {
      // unlike
      const unlike = await likeModel.findByIdAndDelete(alreadyLiked._id)

      // return unlike
      return unlike
    }

    // like
    const like = await likeModel.create({
      user: context.user._id,
      post: postId
    })

    // return like
    return like
  }
}

module.exports = likeMutations