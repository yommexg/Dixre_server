const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  postTitle: {
    type: String,
    required: true,
  },

  postContent: {
    type: String,
    required: true,
  },

  postImg: [
    {
      data: Buffer,
      contentType: String,
      filename: String,
    },
  ],

  author: {
    ref: "User",
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", postSchema);
