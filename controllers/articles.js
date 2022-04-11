const mongoose = require ("mongoose")

const { getAllArticle } = require("../models/Article")

const getArticleList = async (req, res) => {
    let articles = await getAllArticle()
    res.json({ articles })
}

module.exports = { getArticleList }