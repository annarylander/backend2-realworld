const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
  title: { type: String },
  description: { type: String },
  body: { type: String },
  tagList: { type: Array },
  slug: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now, required: true},
  updatedAt: { type: Date, default: Date.now, required: true}
},
  { timestamps: true}
);

const Article = mongoose.model("Article", articleSchema);

// const getAllArticle = async () => {
//   const articles = await Article.find().exec();
//   return articles;
// };

// module.exports = { getAllArticle }

exports.Article = Article;
