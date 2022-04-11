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
const PORT = 3000;

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
    { expiresIn: "24 h", subject: userId }
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
  const user = await User.findOne({ _id: req.user.userId });
  res.json(user);
});

// app.put("/api/user", async (req, res) => {
//   console.log(req.body.user);
//   console.log(req.user.userId);
//   const { email, username, bio, password, image } = req.body.user;
//   try {
//     await User.findOneAndUpdate(
//       { _id: req.user.userId },
//       {
//         $set: {
//           username: username,
//           bio: bio,
//           email: email,
//           image: image,
//           password: password,
//         },
//       }
//     );
//     res.status(201).json({
//       user: {
//         email: email,
//         username: username,
//         bio: bio,
//         image: image,
//       },
//     });
//   } catch (err) {
//     console.log(err);
//   }
// });

app.put("/api/user", requireLogin, async (req, res) => {
  console.log(`user: ${req.body.user}`);
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
      },
      { returnDocument: "after" }
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

app.post("/api/articles", async (req, res) => {
  const { title, description, body, tagList } = req.body.article;
  try {
    const article = await Article.create({
      title: title,
      description: description,
      body: body,
      tagList: tagList,
    });
    res.status(201).json({ article });
  } catch (err) {
    console.log(err);
    res.status(400);
  }
});

mongoose.connect("mongodb://localhost/realworld");
app.listen(PORT, () => {
  console.log(`Started Express server on port ${PORT}`);
});
