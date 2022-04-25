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
    slug: { type: String, slug: "title", unique: true },
    favorited: { type: Boolean, default: false },
    favoritesCount: { type: Number, default: 0 },
    favoritedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

articleSchema.pre("save", function (next) {
  this.slug = this.title.split(" ").join("-");
  next();
});

const Article = mongoose.model("Article", articleSchema);

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

const getAllArticlesModel = async () => {
  const articles = await Article.find()
    .populate("author", "username image -_id")
    .sort({ createdAt: -1 });
  return articles;
};

const getArticlesByAuthor = async (author) => {
  const user = await User.findOne({ username: author });
  const articles = await Article.find({ author: user._id })
    .populate("author", "username image -_id")
    .sort({ createdAt: -1 });
  return articles;
};

const getArticlesByTag = async (tag) => {
  const articles = await Article.find({ tagList: tag })
    .populate("author", "username image -_id")
    .sort({ createdAt: -1 });
  return articles;
};

const getArticlesByFavorited = async (favorited) => {
  const user = await User.findOne({ username: favorited });
  const articles = await Article.find({ favoritedBy: user._id })
    .populate("author", "username image -_id")
    .sort({ createdAt: -1 });
  return articles;
};

const getArticleBySlugModel = async (slug) => {
  const article = await Article.findOne({ slug: slug }).populate(
    "author",
    "username image -_id"
  );
  return article;
};

const updateArticleBySlugModel = async (slug, description, body, title) => {
  const article = await Article.findOneAndUpdate(
    { slug },
    { $set: { description, body, title, slug: title } }
  );
  return article;
};

const setFavoriteArticleModel = async (user, slug) => {
  const article = await Article.findOneAndUpdate(
    { slug },
    { $inc: { favoritesCount: 1 }, $addToSet: { favoritedBy: user } }
  );
  return article;
};

const removeFavoriteArticleModel = async (user, slug) => {
  const article = await Article.findOneAndUpdate(
    { slug },
    { $inc: { favoritesCount: -1 }, $pull: { favoritedBy: user } }
  );
  return article;
};

module.exports = {
  getAllArticlesModel,
  getArticlesByAuthor,
  getArticlesByTag,
  createArticleModel,
  getArticleBySlugModel,
  updateArticleBySlugModel,
  setFavoriteArticleModel,
  getArticlesByFavorited,
  removeFavoriteArticleModel,
};

exports.Article = Article;
