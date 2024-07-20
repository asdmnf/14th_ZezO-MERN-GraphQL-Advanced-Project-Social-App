const { inputRule } = require("graphql-shield");


exports.getAllCommentsValidation = inputRule()(
  (yup, context) =>
    yup.object({
      postId: yup.string().required().matches(/^[0-9a-fA-F]{24}$/, "Invalid ID").trim(),
      page: yup.number().min(1).integer("page must be an integer"),
      limit: yup.number().min(1).integer("limit must be an integer"),
      sort: yup.string(),
      first: yup.number().min(1).integer("first must be an integer"),
      last: yup.number().min(1).integer("last must be an integer"),
    }),
)