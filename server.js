const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const bcrypt = require("bcrypt");

const { User } = require("./models/User");
const { Article } = require("./models/Article");
const mongoose = require("mongoose");
const { use } = require("passport");

const app = express();

const PORT = process.env.PORT;
const MONGODB_URL = process.env.MONGODB_URL;

app.use(express.json());
app.use(express.static("dist"));

const requireLogin = (req, res, next) => {
  console.log("dsasdadsa");
  const authHeader = req.header("Authorization");

  try {
    const token = authHeader.split(" ")[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    console.log("inloggad");
    console.log(token);
    req.user.token = token;
    console.log(req.user);
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

app.get("/user", requireLogin, async (req, res) => {
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
    res.status(201).json({
      user: {
        email: updatedUser.email,
        username: updatedUser.username,
        bio: updatedUser.bio,
        image: updatedUser.image,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/api/articles", requireLogin, async (req, res) => {
  const { title, description, body, tagList } = req.body.article;
  const user = req.user;
  try {
    const article = await Article.create({
      title: title,
      description: description,
      body: body,
      tagList: tagList,
      author: user.userId,
    });
    res.status(201).json({ article });
  } catch (err) {
    console.log(err);
    res.status(400);
  }
});

mongoose.connect(MONGODB_URL);
app.listen(PORT, () => {
  console.log(`Started Express server on port ${PORT}`);
});
