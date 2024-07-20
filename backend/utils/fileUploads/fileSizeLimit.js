const CustomGQLError = require("../../graphql/errors/CustomGQLError");


const fileSizeLimit = (totalFileSize, maxSize) => {
  if (totalFileSize > parseInt(maxSize)) {
    throw new CustomGQLError(
      `File too large ${Math.round(totalFileSize/ 1000000)}MB, max ${Math.round(maxSize / 1000000)}MB`,
      "FILE_TOO_LARGE"
      );
    }
}

module.exports = fileSizeLimit