const express = require('express')
const async = require('hbs/lib/async')
const { searchObjectbyPrice, searchObjectbyName, insertObject, getAll, deleteDocumentById, getDocumentById, updateDocument, } = require('../databaseHandler')
const router = express.Router()

router.get('/', async (req, res) => {
    var result = await getAll("Book")
    const searchInput = req.query.search
    if (isNaN(Number.parseFloat(searchInput)) == false) {
        await SearchObject(searchInput, res, result,searchObjectbyPrice, "Book", Number.parseFloat(searchInput), " VND")
    } else {
        await SearchObject(searchInput, res, result,searchObjectbyName, "Book", searchInput, "")
    }

})

module.exports = router;


async function SearchObject(searchInput, res, result, dbFunction, collectionName, searchInput, mess) {
    const resultSearch = await dbFunction(collectionName, searchInput)
    if (searchInput == null) {
        res.render('home', { books: result })
    }
    else {
        if (resultSearch.length != 0) {
            res.render('home', { books: resultSearch })
        } else {
            const message = ("Not found " + searchInput + mess)
            res.render('home', { books: result, errorSearch: message })
        }
    }
}
