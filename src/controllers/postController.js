const Post = require("../models/post");

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("comments");
    res.json(posts);
  } catch (error) {
    console.error("Error fetching all posts:", error);
    res.status(500).send(error.message);
  }
};

const getPostById = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId).populate("comments");

    if (!post) {
      return res.status(404).send("Post not found");
    }

    res.json(post);
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    res.status(500).send(error.message);
  }
};

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

    if (!post) {
      return res
        .status(403)
        .send("Forbidden: Post not found or you don't have permission.");
    }

    await Comment.deleteMany({ post: postId });
    await post.remove();

    res.sendStatus(200);
  } catch (error) {
    console.error("Error deleting post:", error);
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
  getAllPosts,
  getPostById,
  createPost,
  deletePost,
  createSubPost,
  editPost,
};
