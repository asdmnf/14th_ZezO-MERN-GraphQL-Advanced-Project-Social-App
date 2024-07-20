const { inputRule } = require("graphql-shield");

exports.updateUserValidation = inputRule()(
  (yup, context) =>
    yup.object({
      id: yup.string().required().matches(/^[0-9a-fA-F]{24}$/, "Invalid ID").trim(),
      name: yup.string().required("name is required").trim(),
      email: yup.string().email('Invalid email format!').required(),
    }),
)