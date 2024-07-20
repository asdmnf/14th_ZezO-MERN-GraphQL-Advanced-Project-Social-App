const path = require("path")
const fs = require("fs")
const bcrypt = require("bcryptjs")
const { v4: uuidv4 } = require('uuid');
const userModel = require("../../models/userModel")
const generateToken = require("../../utils/generateToken");
const uploadSingleFile = require("../../utils/fileUploads/uploadSingleFile");
const { updateOneDocument, deleteOneDocument } = require("../../utils/handlersFactory");
const CustomGQLError = require("../errors/CustomGQLError");
const deleteSingleFile = require("../../utils/fileUploads/deleteSingleFile");


const userMutations = {
  // register user
  registerUser: async (parent, {registerInput: {name, email, password, file}}, context, info) => {
      // check if user exists
      const existingUser = await userModel.findOne({email})
      if (existingUser) {
        throw new CustomGQLError("User already exists", "USER_ALREADY_EXISTS")
      }

      // upload image
      let image = undefined
      if (file) {
        const {encyptedFilename} = await uploadSingleFile(file, context, "profile-image", "users")
        image = encyptedFilename
      }

      // create user
      const user = await userModel.create({
        name,
        email,
        password: await bcrypt.hash(password, 12),
        image,
      })

      // generate token
      const token = generateToken(user)

      // return user with token
      return {
        user,
        token,
      }
  },
  // login user
  loginUser: async (parent, args, context, info) => {
    // check if user not exists
    const user = await userModel.findOne({email: args.email})
    if (!user) {
      throw new CustomGQLError("User not found", "USER_NOT_FOUND")
    }

    // check if password is correct
    const isEqual = await bcrypt.compare(args.password, user.password)
    if (!isEqual) {
      throw new CustomGQLError("Incorrect password", "INCORRECT_PASSWORD")
    }

    // generate token
    const token = generateToken(user)

    // return user with token
    return {
      user,
      token,
    }
  },
  // update user
  updateUser: async (parent, args, context, info) => {
    // send file prefix and file folder in case of update request contains new image file
    return updateOneDocument(userModel, args, context, "profile-image", "users")
  },
  // update user password
  updateUserPassword: async (parent, args, context, info) => {
    // update user password
    const updatedUser = await userModel.findByIdAndUpdate(
      args.id,
      {
        password: await bcrypt.hash(args.passwordConfirm, 12),
      },
      {new: true}
      )

    // return updated user
    return updatedUser
  },
  // delete user
  deleteUser: async (parent, args, context, info) => {
    // delete user image from server
    const user = await userModel.findById(args.id)
    if (user.image) deleteSingleFile("users", user.image)

    // delete user
    return deleteOneDocument(userModel, args, context)
  },
  uploadFile: async (parent, args, context, info) => {
    const totalFileSize = parseInt(context.req.headers['content-length']);
    if (totalFileSize > parseInt(process.env.IMAGE_MAX_SIZE)) {
      throw new Error(`File too large, max ${(process.env.IMAGE_MAX_SIZE / 1000000)}MB`)
    }
    const {filename, mimetype, encoding, createReadStream} = await args.file
    const {name, ext} = path.parse(filename)
    const encyptedFilename = `profile-image-${uuidv4()}-${Date.now()}${ext}`
    const filePath = `uploads/users/${encyptedFilename}`
    const stream = createReadStream()
    const result = await new Promise((resolve, reject) => {
      let uploadedBytes = 0;
      stream
      .on("data", (chunk) => {
        uploadedBytes += chunk.length
        const progress = (uploadedBytes / totalFileSize) * 100;
        console.log(`Upload progress: ${progress.toFixed(2)}%`);
      })
      .on("error", (error) => {
        // delete the truncated file
        fs.unlinkSync(filePath)
        reject(error)
      })
      .pipe(fs.createWriteStream(filePath))
      .on("error", (error) => {
        reject(error)
      })
      .on("finish", () => resolve("done"))
    })
    console.log(result)
  }
}

module.exports = userMutations