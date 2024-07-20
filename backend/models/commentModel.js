const mongoose = require('mongoose');

// comment schema
const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  comment: {
    type: String,
  }
}, {
  timestamps: true
})

// populate user
commentSchema.pre(["find", "findOne", "findOneAndUpdate"], function (next) {
  this.populate('user');
  next();
});
// populate user when creating comment
commentSchema.pre("save", function (next) {
  this.populate('user');
  next();
});

// comment model
const commentModel = mongoose.model('Comment', commentSchema);

module.exports = commentModel

