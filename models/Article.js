const mongoose = require("mongoose");
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const articleSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String },
    description: { type: String },
    body: { type: String },
    tagList: { type: Array },
    slug: { type: String, slug: "title", unique: true},
    favorited: { type: Boolean, default: false },
    favoritesCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

articleSchema.pre("save", function(next) {
  this.slug = this.title.split(" ").join("-");
  next();
});
const Article = mongoose.model("Article", articleSchema);

const getAllArticle = async () => {
  const articles = await Article.find();
  return articles;
};

const createArticleModel = async ({author, title, description, body, tagList})=>{
  const article = await Article.create({
    title: title,
    description: description,
    body: body,
    tagList: tagList,
    author: author
  })
  return article
}

module.exports = { getAllArticle, createArticleModel }

exports.Article = Article;
