const mongoose = require('mongoose');

// like schema
const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  }
}, {
  timestamps: true
})

// populate user
likeSchema.pre(["find", "findOneAndDelete", "save"], function (next) {
  this.populate('user');
  next();
});

// like model
const likeModel = mongoose.model('Like', likeSchema);

module.exports = likeModel