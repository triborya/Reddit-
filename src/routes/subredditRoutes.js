const express = require("express");
const router = express.Router();
const {
  createSubreddit,
  deleteSubreddit,
} = require("../controllers/subredditController");

router.post("/create-subreddit", createSubreddit);
router.delete("/delete-subreddit/:subredditId", deleteSubreddit);

module.exports = router;
