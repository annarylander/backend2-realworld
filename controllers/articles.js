const { getAllArticle, createArticleModel } = require("../models/Article")

const getArticleList = async (req, res) => {
    let articles = await getAllArticle()
    const articlesCount = articles.length
    res.json({ articles, articlesCount })
}

const createArticle = async (req,res) => {
  const {title, description, body, tagList} = req.body.article
  const user = req.user
  try {
    const article = await createArticleModel({
      title: title,
      description: description,
      body: body,
      tagList: tagList,
      author: user.userId,
    });
    res.status(201).json({ article });
  } catch (err) {
    console.log(err);
    res.status(400);
  }
};

module.exports = { getArticleList, createArticle }