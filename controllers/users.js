const { User } = require("../models/User");
const bodyParser = require("body-parser");
const { createToken } = require("../controllers/auth");

const registerUser = async (req, res) => {
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
};

const loginUser = async (req, res) => {
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
};

const getCurrentUser = async (req, res) => {
  let user = await User.findOne({ _id: req.user.userId });
  user = user.toObject();
  user.token = req.user.token;
  res.json({ user });
};

const updateUser = async (req, res) => {
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
};

const getUserProfile = async (req, res) => {
  const username = req.params.username;
  const user = await User.findOne({ username: username });
  res.json({
    profile: {
      username: user.username,
      bio: user.bio,
      image: user.image,
    },
  });
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  updateUser,
  getUserProfile,
};
