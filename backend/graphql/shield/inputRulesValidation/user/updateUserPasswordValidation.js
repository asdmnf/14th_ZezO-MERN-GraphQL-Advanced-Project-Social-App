const { inputRule } = require("graphql-shield");


exports.updateUserPasswordValidation = inputRule()(
  (yup, context) =>
    yup.object({
      id: yup.string().required().matches(/^[0-9a-fA-F]{24}$/, "Invalid ID").trim(),
      password: yup.string().required().trim(),
      passwordConfirm: yup.string().required().trim().oneOf([yup.ref('password')], 'Passwords must match'),
    }),
)