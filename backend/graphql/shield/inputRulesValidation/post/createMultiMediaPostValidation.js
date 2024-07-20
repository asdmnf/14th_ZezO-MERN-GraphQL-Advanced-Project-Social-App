const { inputRule } = require("graphql-shield");


exports.createMultiMediaPostValidation = inputRule()(
  (yup, context) =>
    yup.object({
      title: yup.string().required("title is required").trim().min(10, "title must be at least 10 characters").max(100, "title must be at most 100 characters"),
      description: yup.string().required("description is required").trim(),
    }),
)