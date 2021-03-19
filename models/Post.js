const mongoose = require("mongoose");
const User = require("./User");

const post = mongoose.Schema({
  name: {
    type: String,
  },
  body: {
    type: String,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
  },
});

module.exports = mongoose.model("Post", post);
