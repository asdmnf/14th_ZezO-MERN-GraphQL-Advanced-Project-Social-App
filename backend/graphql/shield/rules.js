const { rule, inputRule } = require("graphql-shield")
const CustomGQLError = require("../errors/CustomGQLError")

exports.isAuthenticated = rule({ cache: 'contextual' })(async (parent, args, context, info) => {
  if (!context.user) {
    throw new CustomGQLError('Not authenticated, please login', "UNAUTHENTICATED")
  }
  return true
})

exports.isAdmin = rule({ cache: 'contextual' })(async (parent, args, context, info) => {
  if (!context.user.isAdmin) {
    throw new CustomGQLError('Not authorized, only admins are allowed', "FORBIDDEN")
  }
  return true
})

exports.isSelf = rule({ cache: 'contextual' })(async (parent, args, context, info) => {
  if (context.user._id.toString() !== args.id) {
    throw new CustomGQLError('Not authorized, only owner is allowed', "FORBIDDEN")
  }
  return true
})