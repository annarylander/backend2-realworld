const { getAllArticles, createArticleModel, getArticlesByAuthor, getArticlesByTag } = require("../models/Article")

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

const getArticleList = async (req, res) => {
  const author = req.query.author
  const tag = req.query.tag

  if (author){
      try {
        const articles = await getArticlesByAuthor(author)
        const articlesCount = articles.length
          res.json({ articles, articlesCount })
            } catch (err) {
              console.log(err)
          res.json({ err })
          }
      } else if (tag) {
        const articles = await getArticlesByTag(tag)
        const articlesCount = articles.length
        res.json({ articles, articlesCount })
      } else {
        try {
          const articles = await getAllArticles()
          const articlesCount = articles.length
          res.json({ articles, articlesCount })
         
      } catch (err) {
          res.json({ err })
      }
  }
}

module.exports = { getArticleList, createArticle }