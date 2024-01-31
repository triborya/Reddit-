const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

dotenv.config();

const registerUser = async (req, res) => {
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
    res.send(error);
  }
};

const loginUser = async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).send("Utilisateur non trouvé");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Mot de passe incorrect");

  const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token });
};

module.exports = {
  registerUser,
  loginUser,
};
