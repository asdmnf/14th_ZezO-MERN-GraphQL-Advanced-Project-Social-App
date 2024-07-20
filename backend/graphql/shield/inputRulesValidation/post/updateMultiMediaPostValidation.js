const { inputRule } = require("graphql-shield");


exports.updateMultiMediaPostValidation = inputRule()(
  (yup, context) =>
    yup.object({
      id: yup.string().required().matches(/^[0-9a-fA-F]{24}$/, "Invalid ID").trim(),
      title: yup.string().trim().min(10, "title must be at least 10 characters").max(100, "title must be at most 100 characters"),
      description: yup.string().trim(),
    }),
)