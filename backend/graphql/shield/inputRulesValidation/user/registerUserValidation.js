const { inputRule } = require("graphql-shield")
const userModel = require("../../../../models/userModel")


exports.registerUserValidation = inputRule()(
  (yup, context) => {
    return yup.object({
      registerInput: yup.object({
        name: yup
        .string().required().trim(),
        email: yup.string().email('Invalid email format!').required()
        ,
        password: yup.string().required().trim(),
        passwordConfirm: yup.string().required().trim().oneOf([yup.ref('password')], 'Passwords must match'),
      })
    })
  }, {
    abortEarly: false
  }
)