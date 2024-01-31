require('source-map-support/register');
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const express = __webpack_require__(/*! express */ "express");
const cors = __webpack_require__(/*! cors */ "cors");
const mongoose = __webpack_require__(/*! mongoose */ "mongoose");
const bcrypt = __webpack_require__(/*! bcrypt */ "bcrypt");
const jwt = __webpack_require__(/*! jsonwebtoken */ "jsonwebtoken");
const bodyParser = __webpack_require__(/*! body-parser */ "body-parser");
const app = express();
const PORT = 6969;
app.use(bodyParser.json());
app.use(cors());
mongoose.connect("mongodb://localhost:27017/reddit_clone");
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: {
    type: String,
    default: "user"
  }
});
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment"
  }]
});
const commentSchema = new mongoose.Schema({
  content: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  }
});
const subredditSchema = new mongoose.Schema({
  name: String,
  description: String,
  moderators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  }]
});
const Subreddit = mongoose.model("Subreddit", subredditSchema);
const Post = mongoose.model("Post", postSchema);
const Comment = mongoose.model("Comment", commentSchema);
const User = mongoose.model("User", userSchema);
const authenticateToken = (req, res, next) => {
  const tokenHeader = req.headers.authorization;
  const token = tokenHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "Accès non autorisé. Token manquant."
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Token invalide."
    });
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
      password: hashedPassword
    });
    await user.save();
    res.sendStatus(201);
  } catch (error) {
    res.sendStatus(500);
  }
});
app.post("/login", async (req, res) => {
  const user = await User.findOne({
    username: req.body.username
  });
  if (!user) return res.status(400).send("Utilisateur non trouvé");
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Mot de passe incorrect");
  const token = jwt.sign({
    user
  }, "your-secret-key", {
    expiresIn: "7d"
  });
  res.json({
    token
  });
});
app.post("/create-subreddit", authenticateToken, async (req, res) => {
  try {
    console.log("Request User ID:", req.user._id);
    const {
      name,
      description
    } = req.body;
    const subreddit = new Subreddit({
      name,
      description,
      moderators: [req.user._id]
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
    const {
      title,
      content
    } = req.body;
    const post = new Post({
      title,
      content,
      author: req.user._id
    });
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
    const {
      title,
      content
    } = req.body;
    const post = new Post({
      title,
      content,
      author: req.user._id
    });
    await post.save();
    subreddit.posts.push(post._id);
    await subreddit.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
app.delete("/delete-subreddit/:subredditId", authenticateToken, async (req, res) => {
  try {
    const subredditId = req.params.subredditId;
    const subreddit = await Subreddit.findOne({
      _id: subredditId,
      moderators: req.user._id
    });
    if (!subreddit) return res.sendStatus(403);
    await Post.deleteMany({
      _id: {
        $in: subreddit.posts
      }
    });
    await Comment.deleteMany({
      post: {
        $in: subreddit.posts
      }
    });
    await Subreddit.deleteOne({
      _id: subredditId
    });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
app.put("/edit-post/:postId", authenticateToken, async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findOne({
      _id: postId,
      author: req.user._id
    });
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
    const post = await Post.findOne({
      _id: postId,
      author: req.user._id
    });
    if (!post) return res.sendStatus(403);
    await Comment.deleteMany({
      post: postId
    });
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
      post: postId
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

/***/ }),

/***/ 0:
/*!****************************!*\
  !*** multi ./src/index.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\Users\gorob\Desktop\reddit\src/index.js */"./src/index.js");


/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("bcrypt");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("cors");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ })

/******/ });
//# sourceMappingURL=main.map