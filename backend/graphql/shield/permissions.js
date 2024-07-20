const { shield, and, not } = require("graphql-shield");
const { isAuthenticated, isAdmin, isSelf } = require("./rules");
const CustomGQLError = require("../errors/CustomGQLError");
const { updateUserValidation } = require("./inputRulesValidation/user/updateUserValidation");
const { getOneUserValidation } = require("./inputRulesValidation/user/getOneUserValidation");
const { registerUserValidation } = require("./inputRulesValidation/user/registerUserValidation");
const { loginUserValidation } = require("./inputRulesValidation/user/loginUserValidation");
const { updateUserPasswordValidation } = require("./inputRulesValidation/user/updateUserPasswordValidation");
const { deleteUserValidation } = require("./inputRulesValidation/user/deleteUserValidation");
const { updateUserImageValidation } = require("./inputRulesValidation/user/updateUserImageValidation");
const { getAllUsersValidation } = require("./inputRulesValidation/user/getAllUsersValidation");
const { getAllPostsValidation } = require("./inputRulesValidation/post/getAllPostsValidation");
const { getOnePostValidation } = require("./inputRulesValidation/post/getOnePostValidation");
const { createPostValidation } = require("./inputRulesValidation/post/createPostValidation");
const { updatePostValidation } = require("./inputRulesValidation/post/updatePostValidation");
const { deletePostValidation } = require("./inputRulesValidation/post/deletePostValidation");
const { createMultiMediaPostValidation } = require("./inputRulesValidation/post/createMultiMediaPostValidation");
const { updateMultiMediaPostValidation } = require("./inputRulesValidation/post/updateMultiMediaPostValidation");
const { deleteMultiMediaPostValidation } = require("./inputRulesValidation/post/deleteMultiMediaPostValidation");
const { getAllCommentsValidation } = require("./inputRulesValidation/comment/getAllCommentsValidation");
const { getOneCommentValidation } = require("./inputRulesValidation/comment/getOneCommentValidation");
const { createCommentValidation } = require("./inputRulesValidation/comment/createCommentValidation");
const { updateCommentValidation } = require("./inputRulesValidation/comment/updateCommentValidation");
const { deleteCommentValidation } = require("./inputRulesValidation/comment/deleteCommentValidation");
const { getAllLikesValidation } = require("./inputRulesValidation/like/getAllLikesValidation");
const { toggleLikeValidation } = require("./inputRulesValidation/like/toggleLikeValidation");

const permissions = shield(
  {
  Query: {
    // user
    getAllUsers: and(isAuthenticated, isAdmin, getAllUsersValidation),
    getOneUser: and(isAuthenticated, getOneUserValidation),
    getMe: isAuthenticated,

    // post
    getAllPosts: getAllPostsValidation,
    getOnePost: getOnePostValidation,

    // comment
    getAllComments: getAllCommentsValidation,
    getOneComment: getOneCommentValidation,

    // like
    getAllLikes: getAllLikesValidation
  },
  Mutation: {
    // user
    registerUser: registerUserValidation,
    loginUser:  loginUserValidation,
    updateUser: and(isAuthenticated, isSelf, updateUserValidation),
    updateUserPassword: and(isAuthenticated, isSelf, updateUserPasswordValidation),
    deleteUser: and(isAuthenticated, isAdmin, deleteUserValidation),

    // post
    // createPost: and(isAuthenticated, createPostValidation),
    // updatePost: and(isAuthenticated, isSelf, updatePostValidation),
    deletePost: and(isAuthenticated, deletePostValidation),

    // multi media post
    // createMultiMediaPost: and(isAuthenticated, createMultiMediaPostValidation),
    // updateMultiMediaPost: and(isAuthenticated, isSelf, updateMultiMediaPostValidation),
    deleteMultiMediaPost: and(isAuthenticated, deleteMultiMediaPostValidation),
    
    // comment
    createComment: and(isAuthenticated, createCommentValidation),
    updateComment: and(isAuthenticated, isSelf, updateCommentValidation),
    deleteComment: and(isAuthenticated, isSelf, deleteCommentValidation),
  
    // like
    toggleLike: and(isAuthenticated, toggleLikeValidation)
  },

}, 
{
  fallbackError: new CustomGQLError("Not Authorized! this is global error", "GLOBAL_ERROR"),

  allowExternalErrors: true,

  debug: true,
}
);

module.exports = permissions