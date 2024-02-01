const Comment = require("../models/comment");

const createComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).send("Post not found");

    const comment = new Comment({
      content: req.body.content,
      author: req.user._id,
      post: postId,
    });

    await comment.save();
    post.comments.push(comment._id);
    await post.save();

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  createComment,
};
