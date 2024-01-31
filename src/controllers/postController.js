const Post = require("../models/post");

const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = new Post({ title, content, author: req.user._id });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findOne({ _id: postId, author: req.user._id });
    if (!post) return res.sendStatus(403);

    await Comment.deleteMany({ post: postId });
    await post.remove();

    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const createSubPost = async (req, res) => {
  try {
    const subredditId = req.params.subredditId;
    const subreddit = await Subreddit.findById(subredditId);
    if (!subreddit) return res.status(404).send("Subreddit not found");

    const { title, content } = req.body;
    const post = new Post({ title, content, author: req.user._id });
    await post.save();

    subreddit.posts.push(post._id);
    await subreddit.save();

    res.status(201).json(post);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const editPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findOne({ _id: postId, author: req.user._id });
    if (!post) return res.sendStatus(403);

    post.title = req.body.title;
    post.content = req.body.content;
    await post.save();

    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Other post-related controller functions

module.exports = {
  createPost,
  deletePost,
  createSubPost,
  editPost,
};
