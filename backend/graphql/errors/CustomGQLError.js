const { GraphQLError } = require("graphql");

class CustomGQLError extends GraphQLError {
  constructor(message, code) {
    super(message);
    this.extensions.code = code
  }

}

module.exports = CustomGQLError