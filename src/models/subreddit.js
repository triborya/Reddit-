const mongoose = require("mongoose");

const subredditSchema = new mongoose.Schema({
  name: String,
  description: String,
  moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
});

module.exports = mongoose.model("Subreddit", subredditSchema);
