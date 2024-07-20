const { inputRule } = require("graphql-shield");


exports.deletePostValidation = inputRule()(
  (yup, context) =>
    yup.object({
      id: yup.string().required().matches(/^[0-9a-fA-F]{24}$/, "Invalid ID").trim(),
    }),
)