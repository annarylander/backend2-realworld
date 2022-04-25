const {
  getAllArticlesModel,
  createArticleModel,
  getArticlesByAuthor,
  getArticlesByTag,
  getArticleBySlugModel,
  updateArticleBySlugModel,
  setFavoriteArticleModel,
  getArticlesByFavorited,
  removeFavoriteArticleModel,
} = require("../models/Article");

const { User } = require("../models/User");

const createArticle = async (req, res) => {
  const { title, description, body, tagList } = req.body.article;
  const user = req.user;
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
  const author = req.query.author;
  const tag = req.query.tag;
  const favorited = req.query.favorited;

  if (author) {
    try {
      const articles = await getArticlesByAuthor(author);
      const articlesCount = articles.length;
      res.json({ articles, articlesCount });
    } catch (err) {
      console.log(err);
      res.json({ err });
    }
  } else if (tag) {
    const articles = await getArticlesByTag(tag);
    const articlesCount = articles.length;
    res.json({ articles, articlesCount });
  } else if (favorited) {
    const articles = await getArticlesByFavorited(favorited);
    const articlesCount = articles.length;
    res.json({ articles, articlesCount });
  } else {
    try {
      const articles = await getAllArticlesModel();
      const articlesCount = articles.length;
      res.json({ articles, articlesCount });
    } catch (err) {
      res.json({ err });
    }
  }
};

const getArticleBySlug = async (req, res) => {
  const slug = req.params.slug;
  const article = await getArticleBySlugModel(slug);
  console.log(article);
  res.json({ article });
};

const updateArticleBySlug = async (req, res) => {
  const request = req.body.article;
  const description = request.description;
  const body = request.body;
  const title = request.title;

  const slug = req.params.slug;

  const article = await updateArticleBySlugModel(
    slug,
    description,
    body,
    title
  );
  res.json({ article });
};

const setFavoriteArticle = async (req, res) => {
  const { slug } = req.params;
  const user = req.user.userId;
  const article = await setFavoriteArticleModel(user, slug);
  res.json({ article });
};

const removeFavoriteArticle = async (req, res) => {
  const { slug } = req.params;
  const user = req.user.userId;
  const article = await removeFavoriteArticleModel(user, slug);
  res.json({ article });
};

module.exports = {
  getAllArticles,
  createArticle,
  getArticleBySlug,
  updateArticleBySlug,
  setFavoriteArticle,
  removeFavoriteArticle,
};
