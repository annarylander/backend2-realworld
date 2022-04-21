const { getAllArticlesModel, createArticleModel, getArticlesByAuthor, getArticlesByTag, getArticleBySlugModel, updateArticleBySlugModel } = require("../models/Article")

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

const getAllArticles = async (req, res) => {
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
          const articles = await getAllArticlesModel()
          const articlesCount = articles.length
          res.json({ articles, articlesCount })
         
      } catch (err) {
          res.json({ err })
      }
  }
}

const getArticleBySlug = async (req, res) => {
  const slug = req.params.slug
  const article = await getArticleBySlugModel(slug)
  res.json({article})
}

const updateArticleBySlug = async (req, res) => {
  const request = req.body.article
  const description = request.description
  const body = request.body
  const title = request.title

  const slug = req.params.slug
  
  const article = await updateArticleBySlugModel(slug, description, body, title)
  res.json({article})
}

module.exports = { getAllArticles, createArticle, getArticleBySlug, updateArticleBySlug }