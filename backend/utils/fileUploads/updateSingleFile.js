const uploadSingleFile = require("./uploadSingleFile");
const deleteSingleFile = require("./deleteSingleFile");
const CustomGQLError = require("../../graphql/errors/CustomGQLError");

const updateSingleFile = async (model, args, context, filePrefix, fileFolder) => {
  // upload new file
  const {encyptedFilename, fileType} = await uploadSingleFile(args.file, context, filePrefix, fileFolder)

  // if upload file success delete old file from server and return updated args
  if (encyptedFilename && fileType) {
    // get old file name and delete it
    const document = await model.findById(args.id);

    // depending on file type if exists delete old file from server and delete old name from database
    if(document.image) {
      const isDeleted = await deleteSingleFile(fileFolder, document.image)
      if(isDeleted) args.image = null
      
    }
    if(document.audio) {
      const isDeleted = await deleteSingleFile(fileFolder, document.audio)
      if(isDeleted) args.audio = null
    }
    if(document.video) {
      const isDeleted = await deleteSingleFile(fileFolder, document.video)
      if(isDeleted) args.video = null
    }
  
    // update args with new file depending on file type
    if(fileType === "image") args.image = encyptedFilename
    if(fileType === "audio") args.audio = encyptedFilename
    if(fileType === "video") args.video = encyptedFilename

    // return updated args
    return args
  } else {
    // if upload file failed throw error
    throw new CustomGQLError("update file failed", "UPDATE_FILE_FAILED");
  }
}

module.exports = updateSingleFile