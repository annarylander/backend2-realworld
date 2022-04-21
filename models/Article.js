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
    favoritesCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

articleSchema.pre("save", function(next) {
  this.slug = this.title.split(" ").join("-");
  next();
});


const Article = mongoose.model("Article", articleSchema);

exports.Article = Article;
