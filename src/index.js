const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const app = express();
const PORT = 6969;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/reddit_clone");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: { type: String, default: "user" },
});

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

const commentSchema = new mongoose.Schema({
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
});

const subredditSchema = new mongoose.Schema({
  name: String,
  description: String,
  moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
});

const Subreddit = mongoose.model("Subreddit", subredditSchema);
const Post = mongoose.model("Post", postSchema);
const Comment = mongoose.model("Comment", commentSchema);
const User = mongoose.model("User", userSchema);

const authenticateToken = (req, res, next) => {
  const tokenHeader = req.headers.authorization;
  const token = tokenHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Accès non autorisé. Token manquant." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalide." });
  }
};

app.get("/", (req, res) => {
  res.send("Welcome to the Reddit Clone API!");
});

app.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
    });
    await user.save();
    res.sendStatus(201);
  } catch (error) {
    res.sendStatus(500);
  }
});

app.post("/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).send("Utilisateur non trouvé");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Mot de passe incorrect");

  const token = jwt.sign({ user }, "your-secret-key", { expiresIn: "7d" });
  res.json({ token });
});

app.post("/create-subreddit", authenticateToken, async (req, res) => {
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
});

app.post("/create-post", authenticateToken, async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = new Post({ title, content, author: req.user._id });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/create-post/:subredditId", authenticateToken, async (req, res) => {
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
});

app.delete(
  "/delete-subreddit/:subredditId",
  authenticateToken,
  async (req, res) => {
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
  }
);

app.put("/edit-post/:postId", authenticateToken, async (req, res) => {
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
});

app.delete("/delete-post/:postId", authenticateToken, async (req, res) => {
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
});

app.post("/create-comment/:postId", authenticateToken, async (req, res) => {
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
});

app.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});
