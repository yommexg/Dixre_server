const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true,
  },

  phoneNumber: {
    type: String,
    required: true,
  },

  gender: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  refreshToken: [String],

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
