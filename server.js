const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const bcrypt = require("bcrypt");

const { User } = require("./models/User");
const { getTags } = require("./controllers/tags");

const {
  getAllArticles,
  createArticle,
  getArticleBySlug,
  updateArticleBySlug,
  setFavoriteArticle,
  removeFavoriteArticle,
} = require("./controllers/articles");

const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT;
const MONGODB_URL = process.env.MONGODB_URL;

app.use(express.json());
app.use(express.static("dist"));

const requireLogin = (req, res, next) => {
  const authHeader = req.header("Authorization");

  try {
    const token = authHeader.split(" ")[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    req.user.token = token;
    next();
  } catch (err) {
    console.log(err);
    res.status(401);
  }
};

const createToken = (user) => {
  const userId = user._id.toString();
  return (token = jwt.sign(
    { userId, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "54 h", subject: userId }
  ));
};

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.post("/api/users", async (req, res) => {
  console.log(req.body);
  const { username, email, password } = req.body.user;
  try {
    const user = new User({
      username: username,
      email: email,
      password: password,
    });
    const createdUser = await user.save();
    const token = createToken(user);
    console.log(token);
    res.status(201).json({
      user: {
        email: email,
        username: username,
        bio: createdUser.bio,
        image: createdUser.image,
        token: token,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Problem to register" });
  }
});

app.post("/api/users/login", async (req, res) => {
  const { email, password } = req.body.user;
  console.log(req.body);
  const user = await User.login(email, password);
  console.log(user);
  if (user) {
    const token = createToken(user);
    res.json({
      user: {
        email: email,
        username: user.username,
        bio: user.bio,
        image: user.image,
        token: token,
      },
    });
  } else {
    res.sendStatus(401);
  }
});

app.get("/api/user", requireLogin, async (req, res) => {
  let user = await User.findOne({ _id: req.user.userId });
  user = user.toObject();
  user.token = req.user.token;
  res.json({ user });
});

app.put("/api/user", requireLogin, async (req, res) => {
  console.log(req.user);
  console.log(`userid: ${req.user.userId}`);
  const { email, username, bio, password } = req.body.user;
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user.userId },
      {
        username: username,
        bio: bio,
        email: email,
        password: password,
      }
    );
    const token = createToken(updatedUser);
    res.status(201).json({
      user: {
        email: updatedUser.email,
        username: updatedUser.username,
        bio: updatedUser.bio,
        image: updatedUser.image,
        token: token,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/api/profiles/:username", async (req, res) => {
  const username = req.params.username;
  const user = await User.findOne({ username: username });
  res.json({
    profile: {
      username: user.username,
      bio: user.bio,
      image: user.image,
    },
  });
});

app.post("/api/articles", requireLogin, createArticle);

app.get("/api/articles/:slug", getArticleBySlug);

app.put("/api/articles/:slug", requireLogin, updateArticleBySlug);

app.get("/api/articles", getAllArticles);

app.get("/api/tags", getTags);

app.post("/api/articles/:slug/favorite", requireLogin, setFavoriteArticle);

app.delete("/api/articles/:slug/favorite", requireLogin, removeFavoriteArticle);

mongoose.connect(MONGODB_URL);
app.listen(PORT, () => {
  console.log(`Started Express server on port ${PORT}`);
});
