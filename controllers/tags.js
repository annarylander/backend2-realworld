const { getAllArticles } = require("../models/Article")

const getTags = async (req, res) => {
    const articles = await getAllArticles()
    let tagList = []

    for (let i = 0; i < articles.length; i++) {
    tagList.push(articles[i].tagList[0])       
    }

    const filteredTags = tagList.filter(element => {
        return element !== undefined
    })

    let tags = [... new Set(filteredTags)]
    res.json({ tags });
}


module.exports = { getTags, }