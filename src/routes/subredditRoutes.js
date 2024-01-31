const express = require("express");
const router = express.Router();
const { createSubreddit } = require("../controllers/subredditController");

router.post("/create-subreddit", createSubreddit);

module.exports = router;
