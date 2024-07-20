const { default: mongoose } = require("mongoose");

// post schema
const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
    minlength: 10,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  audio: {
    type: String,
  },
  video: {
    type: String,
  },
  images: {
    type: [String]
  },
  audios: {
    type: [String]
  },
  videos: {
    type: [String]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// virtual for comments field
postSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post'
})

// virtual for likes field
postSchema.virtual('likes', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'post'
})

// populate user
postSchema.pre(["find", "findOne", "findOneAndUpdate"], function (next) {
  this.populate('user').populate('comments').populate('likes');
  next();
});

// populate user when creating post
postSchema.pre("save", function (next) {
  this.populate('user');
  next();
});

// post model
const postModel = mongoose.model("Post", postSchema);

module.exports = postModel