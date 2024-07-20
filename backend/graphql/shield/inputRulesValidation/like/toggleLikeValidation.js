const { inputRule } = require("graphql-shield");


exports.toggleLikeValidation = inputRule()(
  (yup, context) => 
    yup.object({
      postId: yup.string().required("postId is required").matches(/^[0-9a-fA-F]{24}$/, "Invalid ID").trim(),
    })
)