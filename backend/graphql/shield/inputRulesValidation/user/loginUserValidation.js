const { inputRule } = require("graphql-shield");


exports.loginUserValidation = inputRule()(
  (yup, context) =>
    yup.object({
      email: yup.string().email('Invalid email format!').required(),
      password: yup.string().required().trim(),
    }),
)