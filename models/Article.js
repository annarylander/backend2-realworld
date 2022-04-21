const mongoose = require("mongoose");
const { User } = require("./User")
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
    favoritesCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

articleSchema.pre("save", function(next) {
  this.slug = this.title.split(" ").join("-");
  next();
});


const Article = mongoose.model("Article", articleSchema);

const getArticleBySlugModel = async (slug) => {
    const article = await Article.findOne({slug})
    return article  
}

const getAllArticles = async () => {
  const articles = await Article.find().sort({ createdAt:-1 });
  return articles;
};

const getArticlesByAuthor = async (author) => {
  const user = await User.findOne({ username: author })
  console.log(user)
  const articles = await Article.find({ author: user._id })
  console.log(articles)
  return articles
}

const getArticlesByTag = async (tag) => {
  const articles = await Article.find({ tagList: tag })
  console.log(articles)
  return articles
}

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

module.exports = { getAllArticles, getArticlesByAuthor, getArticlesByTag, createArticleModel, getArticleBySlugModel }

exports.Article = Article;
