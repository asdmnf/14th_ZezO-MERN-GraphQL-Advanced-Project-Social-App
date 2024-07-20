const { makeExecutableSchema } = require("@graphql-tools/schema");
const { applyMiddleware } = require("graphql-middleware");
const { GraphQLUpload } = require("graphql-upload");
const permissions = require("./shield/permissions");
const userQueries = require("./queries/userQueries");
const postQueries = require("./queries/postQueries");
const commentQueries = require("./queries/commentQueries");
const likeQueries = require("./queries/likeQueries");
const userMutations = require("./mutations/userMutations");
const postMutations = require("./mutations/postMutations");
const multiMediaPostMutations = require("./mutations/multiMediaPostMutations");
const commentMutations = require("./mutations/commentMutations");
const likeMutations = require("./mutations/likeMutations");
const userModel = require("../models/userModel");


// typeDefs
const typeDefs = `#graphql

# upload
scalar Upload

# user
type User {
  id: ID
  name: String
  email: String
  isAdmin: Boolean
  image: String
  createdAt: String
  updatedAt: String
}
type AuthPayload {
  user: User,
  token: String
}
type Pagination {
  limit: Int
  previousPage: Int
  currentPage: Int
  nextPage: Int
  totalPages: Int
  resultTotalDocuments: Int
  overallDocuments: Int
}
input RegisterUserInput {
  name: String!
  email: String!
  file: Upload
  password: String!
  passwordConfirm: String!
}
type UserResultWithPaginationPayload {
  data: [User]
  pagination: Pagination
}
input Filter {
  field: String
  value: String
}
input Search {
  field: String
  keyword: String
}

# post
type Post {
  id: ID
  title: String
  description: String
  image: String
  audio: String
  video: String
  images: [String]
  audios: [String]
  videos: [String]
  user: User
  comments: [Comment]
  likes: [Like]
  createdAt: String
  updatedAt: String
}
type PostResultWithPaginationPayload {
  data: [Post]
  pagination: Pagination
}

# comment
type Comment {
  id: ID
  comment: String
  user: User
  post: Post
  createdAt: String
  updatedAt: String
}
type CommentResultWithPaginationPayload {
  data: [Comment]
  pagination: Pagination
}

# like
type Like {
  id: ID
  user: User
  post: Post
  createdAt: String
  updatedAt: String
}
type LikeResultWithPaginationPayload {
  data: [Like]
  pagination: Pagination
}

type Query {
  # user
  getAllUsers(page: Int, limit: Int, sort: String, first: Int, last: Int, filter: [Filter], search: [Search]): UserResultWithPaginationPayload
  getOneUser(id: ID!): User
  getMe: AuthPayload

  # post
  getAllPosts(page: Int, limit: Int, sort: String, first: Int, last: Int, filter: [Filter], search: [Search]): PostResultWithPaginationPayload
  getOnePost(id: ID!): Post

  # comment
  getAllComments(postId: ID!, page: Int, limit: Int, sort: String, first: Int, last: Int, filter: [Filter], search: [Search]): CommentResultWithPaginationPayload
  getOneComment(id: ID!): Comment

  # like
  getAllLikes(page: Int, limit: Int, sort: String, first: Int, last: Int, filter: [Filter], search: [Search]): LikeResultWithPaginationPayload
}

type Mutation {
  # user
  registerUser(registerInput: RegisterUserInput): AuthPayload
  loginUser(email: String!, password: String!): AuthPayload
  updateUser(id: ID!, name: String, email: String, file: Upload): User
  updateUserPassword(id: ID!, password: String!, passwordConfirm: String!): User
  deleteUser(id: ID!): User
  uploadFile(file: Upload!): String

  # post
  createPost(title: String!, description: String!, file: Upload): Post
  updatePost(id: ID!, title: String, description: String, file: Upload): Post
  deletePost(id: ID!): Post

  # mulimedia post
  createMultiMediaPost(title: String!, description: String!, files: [Upload!]!): Post
  updateMultiMediaPost(id: ID!, title: String, description: String, newFiles: [Upload], unModifiedFilesDBNames: [String]): Post
  deleteMultiMediaPost(id: ID!): Post

  # comment
  createComment(postId: ID!, comment: String!): Comment
  updateComment(id: ID!, comment: String!): Comment
  deleteComment(id: ID!): Comment

  # like
  toggleLike(postId: ID!): Like
}
`;

// resolvers
const resolvers = {
  Upload: GraphQLUpload,
  User: {
    image: (parent) => {
      if (parent.image)
      return `${process.env.BASE_URL}/users/${parent.image}`
    },
    createdAt: (parent) => {
      return new Date(parent.createdAt).toLocaleString()
    },
    updatedAt: (parent) => {
      return new Date(parent.updatedAt).toLocaleString()
    },
  },

  Post: {
    image: (parent) => {
      if (parent.image)
      return `${process.env.BASE_URL}/posts/${parent.image}`
    },
    images: (parent) => {
      if (parent.images)
      return parent.images.map(image => `${process.env.BASE_URL}/posts/${image}`)
    },
    audio: (parent) => {
      if (parent.audio)
      return `${process.env.BASE_URL}/posts/${parent.audio}`
    },
    audios: (parent) => {
      if (parent.audios)
      return parent.audios.map(audio => `${process.env.BASE_URL}/posts/${audio}`)
    },
    video: (parent) => {
      if (parent.video)
      return `${process.env.BASE_URL}/posts/${parent.video}`
    },
    videos: (parent) => {
      if (parent.videos)
      return parent.videos.map(video => `${process.env.BASE_URL}/posts/${video}`)
    },
    createdAt: (parent) => {
      return new Date(parent.createdAt).toLocaleString()
    },
    updatedAt: (parent) => {
      return new Date(parent.updatedAt).toLocaleString()
    },
  },

  Query: {
    ...userQueries,
    ...postQueries,
    ...commentQueries,
    ...likeQueries
  },
  Mutation: {
    ...userMutations,
    ...postMutations,
    ...multiMediaPostMutations,
    ...commentMutations,
    ...likeMutations
  }
}

// build schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

// apply schema with permissions
const schemaWithPermissions = applyMiddleware(schema, permissions)

module.exports = schemaWithPermissions