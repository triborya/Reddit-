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

app.use("/", userRoutes);
app.use("/", authenticateToken, postRoutes);
app.use("/", authenticateToken, commentRoutes);
app.use("/", authenticateToken, subredditRoutes);

app.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});
