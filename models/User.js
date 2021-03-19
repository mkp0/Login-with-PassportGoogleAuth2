const mongoose = require("mongoose");

const user = new mongoose.Schema({
  googleid: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", user);
