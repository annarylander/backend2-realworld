const { getAllArticlesModel } = require("../models/Article")

const getTags = async (req, res) => {
    const tagsList = await getAllArticlesModel()
    let tagList = []

    for (let i = 0; i < tagsList.length; i++) {
    tagList.push(tagsList[i].tagList[0])       
    }

    const filteredTags = tagList.filter(element => {
        return element !== undefined
    })

    let tags = [... new Set(filteredTags)]
    res.json({ tags });
}

module.exports = { getTags }