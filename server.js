const express = require("express");
const path = require("path");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT;
const MONGODB_URL = process.env.MONGODB_URL;

const { getTags } = require("./controllers/tags");

const {
  getAllArticles,
  createArticle,
  getArticleBySlug,
  updateArticleBySlug,
  setFavoriteArticle,
  removeFavoriteArticle,
} = require("./controllers/articles");

const {
  registerUser,
  loginUser,
  getCurrentUser,
  updateUser,
  getUserProfile,
} = require("./controllers/users");

const { requireLogin } = require("./controllers/auth");

app.use(express.json());
app.use(express.static("dist"));

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.post("/api/users", registerUser);
app.post("/api/users/login", loginUser);
app.get("/api/user", requireLogin, getCurrentUser);
app.put("/api/user", requireLogin, updateUser);

app.get("/api/profiles/:username", requireLogin, getUserProfile);

app.post("/api/articles", requireLogin, createArticle);
app.get("/api/articles/:slug", getArticleBySlug);
app.put("/api/articles/:slug", requireLogin, updateArticleBySlug);
app.get("/api/articles", getAllArticles);
app.post("/api/articles/:slug/favorite", requireLogin, setFavoriteArticle);
app.delete("/api/articles/:slug/favorite", requireLogin, removeFavoriteArticle);

app.get("/api/tags", getTags);

mongoose.connect(MONGODB_URL);
app.listen(PORT, () => {
  console.log(`Started Express server on port ${PORT}`);
});

// hola