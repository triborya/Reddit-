const Subreddit = require("../models/subreddit");

const createSubreddit = async (req, res) => {
  try {
    console.log("Request User ID:", req.user._id);
    const { name, description } = req.body;
    const subreddit = new Subreddit({
      name,
      description,
      moderators: [req.user._id],
    });

    await subreddit.save();
    console.log("Subreddit Created:", subreddit);
    res.status(201).json(subreddit);
  } catch (error) {
    console.error("Error Creating Subreddit:", error);
    res.status(500).send(error.message);
  }
};

const deleteSubreddit = async (req, res) => {
  try {
    const subredditId = req.params.subredditId;
    const subreddit = await Subreddit.findOne({
      _id: subredditId,
      moderators: req.user._id,
    });
    if (!subreddit) return res.sendStatus(403);

    await Post.deleteMany({ _id: { $in: subreddit.posts } });
    await Comment.deleteMany({ post: { $in: subreddit.posts } });
    await Subreddit.deleteOne({ _id: subredditId });

    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Other subreddit-related controller functions

module.exports = {
  createSubreddit,
  deleteSubreddit,
};
