const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI);

const authenticateToken = require("./middlewares/authenticateToken");

const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const subredditRoutes = require("./routes/subredditRoutes");

app.get("/", (req, res) => {
  res.send("Welcome to the Reddit Clone API!");
});
app.use("/user", userRoutes);
app.use("/post", authenticateToken, postRoutes);
app.use("/comm", authenticateToken, commentRoutes);
app.use("/subreddit", authenticateToken, subredditRoutes);

app.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});
