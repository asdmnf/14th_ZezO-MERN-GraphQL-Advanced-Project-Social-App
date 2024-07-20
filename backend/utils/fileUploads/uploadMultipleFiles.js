const CustomGQLError = require("../../graphql/errors/CustomGQLError")
const uploadSingleFile = require("./uploadSingleFile")


const uploadMultipleFiles = async (files, context, filePrefix, fileFolder) => {
  // check if max number of files is reached
  if (process.env.GRAPHQL_UPLOAD_MAX_FILES < files?.length) {
    throw new CustomGQLError(`Too many files, Max number of files is ${process.env.GRAPHQL_UPLOAD_MAX_FILES}`, "TOO_MANY_FILES")
  }

  // upload files
  const uploadedFiles = await Promise.all(
    files?.map(async (file) => {
      const {encyptedFilename, fileType} = await uploadSingleFile(file, context, filePrefix, fileFolder)
      return {encyptedFilename, fileType}
    })
  )

  // return uploaded files
  return uploadedFiles
}

module.exports = uploadMultipleFiles