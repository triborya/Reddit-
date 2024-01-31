const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = 6969;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/reddit_clone");

// Import middlewares
const authenticateToken = require("./middlewares/authenticateToken");

// Import routes
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const subredditRoutes = require("./routes/subredditRoutes");

// Use routes
app.use("/", userRoutes);
app.use("/", postRoutes);
app.use("/", commentRoutes);
app.use("/", subredditRoutes);

app.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});
