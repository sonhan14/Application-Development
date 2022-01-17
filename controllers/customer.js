const express = require('express')
const async = require('hbs/lib/async')
const {searchObjectbyCategory, searchObjectbyPrice, searchObjectbyName, insertObject, getAll, deleteDocumentById, getDocumentById, updateDocument, } = require('../databaseHandler')
const router = express.Router()

router.get('/', async (req, res) => {
    const truyen = await searchObjectbyCategory("Book","61e570c7ba41b21dee1346b3")
    const ITbook = await searchObjectbyCategory("Book", "61e570ddba41b21dee1346b4")
    const searchInput = req.query.search
    if (isNaN(Number.parseFloat(searchInput)) == false) {
        await SearchObject(searchInput, res, truyen, ITbook,searchObjectbyPrice, "Book", Number.parseFloat(searchInput), " VND")
    } else {
        await SearchObject(searchInput, res, truyen, ITbook,searchObjectbyName, "Book", searchInput, "")
    }

})

async function SearchObject(searchInput, res, truyen, ITbook, dbFunction, collectionName, searchInput, mess) {
    const resultSearch = await dbFunction(collectionName, searchInput)
    if (searchInput == null) {
        res.render('home', { truyens: truyen, ITbooks: ITbook })
    }
    else {
        if (resultSearch.length != 0) {
            res.render('home', { truyens: truyen, ITbooks: ITbook })
        } else {
            const message = ("Not found " + searchInput + mess)
            res.render('home', { truyens: truyen, ITbooks: ITbook, errorSearch: message })
        }
    }
}

module.exports = router;
