const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

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

module.exports = { requireLogin, createToken };
