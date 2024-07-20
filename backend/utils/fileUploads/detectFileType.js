const CustomGQLError = require("../../graphql/errors/CustomGQLError");

  // detect file type
  const detectFileType = (ext) => {
    // image types
    const imageTypes = [".jpeg", ".jpg", ".png", ".gif", ".svg"];

    // audio types
    const audioTypes = [".mp3", ".wav", ".ogg", ".m4a", ".flac", ".aac", ".wma", ".amr"];

    // video types
    const videoTypes = [".mp4", ".avi", ".mkv", ".wmv", ".webm", ".mpg", ".mpeg", ".ts"];

    // all allowed types
    const allowedTypes = [...imageTypes, ...audioTypes, ...videoTypes];

    // throw error if file type is not allowed
    if(!allowedTypes.includes(ext)) {
      throw new CustomGQLError(`Invalid file type, ${ext}`, "INVALID_FILE_TYPE");
    }

    // return file type
    if (imageTypes.includes(ext)) {
      return "image";
    }

    if (audioTypes.includes(ext)) {
      return "audio";
    }

    if (videoTypes.includes(ext)) {
      return "video";
    }

  }

  module.exports = detectFileType