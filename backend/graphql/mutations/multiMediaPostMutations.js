const postModel = require("../../models/postModel")
const deleteSingleFile = require("../../utils/fileUploads/deleteSingleFile")
const uploadMultipleFiles = require("../../utils/fileUploads/uploadMultipleFiles")
const { deleteOneDocument } = require("../../utils/handlersFactory")
const CustomGQLError = require("../errors/CustomGQLError")

const multiMediaPostMutations = {
  // create multi media post
  createMultiMediaPost: async (parent, {title, description, files}, context, info) => {
    // upload files
    const uploadedFiles = await uploadMultipleFiles(files, context, "multi-media-post", "posts")

    // add each uploaded file in corresponding field depending on file type
    const images = uploadedFiles?.filter(file => file.fileType === "image")?.map(file => file.encyptedFilename)
    const audios = uploadedFiles?.filter(file => file.fileType === "audio")?.map(file => file.encyptedFilename)
    const videos = uploadedFiles?.filter(file => file.fileType === "video")?.map(file => file.encyptedFilename)
    
    // create post
    const post = await postModel.create({
      user: context.user._id,
      title,
      description,
      images,
      audios,
      videos
    })

    // return post
    return post
  },
  // update multi media post
  updateMultiMediaPost : async (parent, args, context, info) => {
    const post = await postModel.findById(args.id)

    // check if post exists
    if (!post) throw new CustomGQLError("Post not found", "POST_NOT_FOUND")

    // check if post belongs to user
    if (post?.user._id.toString() !== context.user._id.toString()) throw new CustomGQLError("You can only update your posts", "UNAUTHORIZED")

    // add each recieved unmodified media in corresponding field depending on file type to combine it with new media
    const unmodifiedImages = post?.images?.filter(image => args.unModifiedFilesDBNames?.includes(image)) || []
    const unmodifiedAudios = post?.audios?.filter(audio => args.unModifiedFilesDBNames?.includes(audio)) || []
    const unmodifiedVideos = post?.videos?.filter(video => args.unModifiedFilesDBNames?.includes(video)) || []

    // upload new files if exists
    let newImages = []
    let newAudios = []
    let newVideos = []
    if (args.newFiles) {
      // upload files
      const uploadedFiles = await uploadMultipleFiles(args.newFiles, context, "multi-media-post", "posts")
      // add each new uploaded file in corresponding field depending on file type
      newImages = uploadedFiles?.filter(file => file.fileType === "image")?.map(file => file.encyptedFilename)
      newAudios = uploadedFiles?.filter(file => file.fileType === "audio")?.map(file => file.encyptedFilename)
      newVideos = uploadedFiles?.filter(file => file.fileType === "video")?.map(file => file.encyptedFilename)
    }

    // combine unmodified media with new media
    const images = [...unmodifiedImages, ...newImages]
    const audios = [...unmodifiedAudios, ...newAudios]
    const videos = [...unmodifiedVideos, ...newVideos]

    // delete old files from server
    // 1- get all media to compare it with unmodified media
    allMedia = [...post?.images, ...post?.audios, ...post?.videos]
    // 2- filter deleted media depending on unModifiedFilesDBNames and allMedia
    const deletedMedia  = allMedia?.filter(media => !args.unModifiedFilesDBNames?.includes(media))
    // 3- delete each deleted media
    deletedMedia?.forEach(async media => await deleteSingleFile("posts", media))

    // updata post
    const updatedPost = await postModel.findByIdAndUpdate(args.id, {
      title: args.title,
      description: args.description,
      images,
      audios,
      videos
    }, {
      new: true
    })

    // return updated post
    return updatedPost
  },
  // delete multi media post
  deleteMultiMediaPost : async (parent, args, context, info) => {
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
    if (post?.images) post.images.forEach(image => deleteSingleFile("posts", image))
    if (post?.audios) post.audios.forEach(audio => deleteSingleFile("posts", audio))
    if (post?.videos) post.videos.forEach(video => deleteSingleFile("posts", video))

    // delete post
    return deleteOneDocument(postModel, args, context)
  }
}

module.exports = multiMediaPostMutations