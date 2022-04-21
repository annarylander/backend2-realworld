const { getAllArticlesModel } = require("../models/Article")

const getTags = async (req, res) => {
    const articleList = await getAllArticlesModel()
    let tagList = []

    articleList.forEach((tagsList) => {
        tagsList.tagList.forEach((singleTag) => {
            tagList.push(singleTag)
        })
    })

    const filteredTags = tagList.filter(element => {
        return element !== undefined
    })

    let tags = [... new Set(filteredTags)]
    res.json({ tags });
}

module.exports = { getTags }