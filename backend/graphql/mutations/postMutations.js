const postModel = require("../../models/postModel")
const { updateOneDocument, deleteOneDocument } = require("../../utils/handlersFactory")
const uploadSingleFile = require("../../utils/fileUploads/uploadSingleFile")
const CustomGQLError = require("../errors/CustomGQLError")
const deleteSingleFile = require("../../utils/fileUploads/deleteSingleFile")
const uploadMultipleFiles = require("../../utils/fileUploads/uploadMultipleFiles")


const postMutations = {
  // create post
  createPost: async (parent, {title, description, file}, context, info) => {
    let image = undefined
    let audio = undefined
    let video = undefined
    
    // upload file
    if (file) {
      const {encyptedFilename, fileType} = await uploadSingleFile(file, context, "single-media-post", "posts")

      // add each uploaded file in corresponding field depending on file type
      if (encyptedFilename && fileType) {
        if (fileType === "image") image = encyptedFilename
        if (fileType === "audio") audio = encyptedFilename
        if (fileType === "video") video = encyptedFilename
      }
    }

    // create post
    const post = await postModel.create({
      user: context.user._id,
      title,
      description,
      image,
      audio,
      video
    })

    // return post
    return post
  },
  // update post
  updatePost: async (parent, args, context, info) => {
    // check if post belongs to user
    const post = await postModel.findById(args.id)
    if (post?.user._id.toString() !== context.user._id.toString()) {
      throw new CustomGQLError("You can only update your posts", "UNAUTHORIZED")
    }

    // update post
    // send file prefix and file folder in case of update request contains new file
    return updateOneDocument(postModel, args, context, "single-media-post", "posts")
  },
  // delete post
  deletePost: async (parent, args, context, info) => {
    const post = await postModel.findById(args.id)

    // check if post exists
    if (!post) {
      throw new CustomGQLError("Post not found", "POST_NOT_FOUND")
    }

    // check if post belongs to user
    if (post?.user._id.toString() !== context.user._id.toString()) {
      throw new CustomGQLError("You can only delete your posts", "UNAUTHORIZED")
    }

    // delete old files from server
    if (post?.image) deleteSingleFile("posts", post.image)
    if (post?.audio) deleteSingleFile("posts", post.audio)
    if (post?.video) deleteSingleFile("posts", post.video)

    // delete post
    return deleteOneDocument(postModel, args, context)
  },
}

module.exports = postMutations