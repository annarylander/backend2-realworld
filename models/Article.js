const mongoose = require("mongoose");
const { User } = require("./User");
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

const articleSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String },
    description: { type: String },
    body: { type: String },
    tagList: { type: Array },
    slug: { type: String, unique: true, required: true },
    favorited: { type: Boolean, default: false },
    favoritesCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Article = mongoose.model("Article", articleSchema);

const getAllArticles = async () => {
  const articles = await Article.find().sort({ createdAt: -1 });
  return articles;
};

const getArticlesByAuthor = async (author) => {
  const user = await User.findOne({ username: author });
  console.log(user);
  const articles = await Article.find({ author: user._id });
  console.log(articles);
  return articles;
};

const getArticlesByTag = async (tag) => {
  const articles = await Article.find({ tagList: tag });
  console.log(articles);
  return articles;
};

const createArticleModel = async ({
  author,
  title,
  description,
  body,
  tagList,
}) => {
  const article = await Article.create({
    title: title,
    description: description,
    body: body,
    tagList: tagList,
    author: author,
  });
  return article;
};

const setFavoriteArticleModel = async (slug) => {
  console.log("nånting")
  const article = await Article.updateOne(
    { slug },
    { $set: { favorited: true } }
  );
  return article

}

module.exports = {
  getAllArticles,
  getArticlesByAuthor,
  getArticlesByTag,
  createArticleModel,
  setFavoriteArticleModel
};

exports.Article = Article;
