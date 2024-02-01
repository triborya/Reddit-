const express = require("express");
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getPostById,
} = require("../controllers/postController");

router.post("/create-post", createPost);

router.get("/get-all-posts", getAllPosts);

router.get("/get-post/:postId", getPostById);

module.exports = router;
