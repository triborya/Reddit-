const express = require("express");
const router = express.Router();
const {
  getAllPosts,
  getPostById,
  createPost,
  deletePost,
  createSubPost,
  editPost,
} = require("../controllers/postController");

router.post("/create-post", createPost);
router.get("/get-all-posts", getAllPosts);
router.get("/get-post/:postId", getPostById);
router.delete("/delete-post/:postId", deletePost);
router.post("/create-subpost/:subredditId", createSubPost);
router.put("/edit-post/:postId", editPost);

module.exports = router;
