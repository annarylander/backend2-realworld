const { getAllArticlesModel } = require("../models/Article")

const getTags = async (req, res) => {
    const tagsList = await getAllArticlesModel()
    let tagList = []

    tagsList.forEach((tags) => {
        tags.tagList.forEach((data) => {
            tagList.push(data)
        })
    })

    const filteredTags = tagList.filter(element => {
        return element !== undefined
    })

    let tags = [... new Set(filteredTags)]
    res.json({ tags });
}

module.exports = { getTags }