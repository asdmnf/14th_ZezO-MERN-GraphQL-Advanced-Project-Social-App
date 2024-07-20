const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const detectFileType = require("./detectFileType");
const fileSizeLimit = require("./fileSizeLimit");

const uploadSingleFile = async (file, context, filePrefix, fileFolder) => {

  // encrypt file name and init path
  const { filename, mimetype, encoding, createReadStream } = await file;
  const { name, ext } = path.parse(filename);
  const encyptedFilename = `${filePrefix}-${uuidv4()}-${Date.now()}${ext}`;
  const filePath = `uploads/${fileFolder}/${encyptedFilename}`;

  // file size and uploaded bytes
  const totalFileSize = parseInt(context.req.headers["content-length"]);
  let uploadedBytes = 0;

  // detect file type
  const fileType = detectFileType(ext);

  // check if file type is allowed and exclude multimedia post files
  if (filePrefix !== "multi-media-post") {
    // check if file size is allowed 
    if (fileType === "image") fileSizeLimit(totalFileSize, process.env.IMAGE_MAX_SIZE);
    if (fileType === "audio") fileSizeLimit(totalFileSize, process.env.AUDIO_MAX_SIZE);
    if (fileType === "video") fileSizeLimit(totalFileSize, process.env.VIDEO_MAX_SIZE);
  }

  // create stream
  const stream = createReadStream();
  // upload stream
  const result = await new Promise((resolve, reject) => {
    stream
      .on("data", (chunk) => {
        // upload progress
        uploadedBytes += chunk.length;
        const progress = (uploadedBytes / totalFileSize) * 100;
        console.log(`Upload progress: ${progress.toFixed(2)}%`);
      })
      .on("error", (error) => {
        // delete truncated file
        fs.unlinkSync(filePath);
        reject(error);
      })
      .pipe(fs.createWriteStream(filePath))
      .on("error", (error) => {
        reject(error);
      })
      .on("finish", () => {
        // upload complete
        console.log("Upload completed");
        resolve({encyptedFilename, fileType});
      });
  });
  return result;
};

module.exports = uploadSingleFile;
