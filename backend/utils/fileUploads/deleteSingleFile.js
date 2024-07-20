const fs = require("fs");
const CustomGQLError = require("../../graphql/errors/CustomGQLError");

const deleteSingleFile = async (fileFolder, DBencyptedFilename) => {
  // path of file
  const filePath = `uploads/${fileFolder}/${DBencyptedFilename}`

  // check if file exist and delete it
  if (fs.existsSync(filePath)) {
    // delete file
    fs.unlinkSync(filePath);
    console.log("File deleted successfully");
    return true
  } else {
    // file not found throw error
    throw new CustomGQLError("Old File Not Found", "FILE_NOT_FOUND");
  }
};

module.exports = deleteSingleFile