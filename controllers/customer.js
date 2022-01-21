const express = require('express');
const res = require('express/lib/response');
const async = require('hbs/lib/async')

const dbHandler = require('../databaseHandler')
const router = express.Router()
router.use(express.static("public"));

router.get("/", async (req, res) => {
    const truyen = await dbHandler.searchObjectbyCategory(
        "Book",
        "61e570c7ba41b21dee1346b3"
    );
    const ITbook = await dbHandler.searchObjectbyCategory(
        "Book",
        "61e570ddba41b21dee1346b4"
    );
    res.render("index", { truyens: truyen, ITbooks: ITbook });
})


router.get("/search", async (req, res) => {
    const truyen = await dbHandler.searchObjectbyCategory(
        "Book",
        "61e570c7ba41b21dee1346b3"
    );
    const ITbook = await dbHandler.searchObjectbyCategory(
        "Book",
        "61e570ddba41b21dee1346b4"
    );
    const searchInput = req.query.searchInput;
    if (isNaN(Number.parseFloat(searchInput)) == false) {
        await SearchObject(
            searchInput,
            res,
            truyen,
            ITbook,
            dbHandler.searchObjectbyPrice,
            "Book",
            Number.parseFloat(searchInput),
            " VND"
        );
    } else {
        await SearchObject(
            searchInput,
            res,
            truyen,
            ITbook,
            dbHandler.searchObjectbyName,
            "Book",
            searchInput,
            ""
        );
    }
});




async function SearchObject(
    searchInput,
    res,
    truyen,
    ITbook,
    dbFunction,
    collectionName,
    searchInput,
    mess
) {
    const resultSearch = await dbFunction(collectionName, searchInput);
    if (resultSearch.length != 0) {
        res.render("search", {searchBook: resultSearch, truyens: truyen, ITbooks: ITbook });
    } else {
        const message = "Not found " + searchInput + mess;
        res.render("search", {
            truyens: truyen,
            ITbooks: ITbook,
            errorSearch: message,
        });
    }

}


router.get('/details', async (req, res) => {
    const id = req.query.id
    const result = await dbHandler.getDocumentById(id, "Book")
    const category = await dbHandler.getDocumentById(result.category, "Category")
    res.render('product_Detail', { details: result, category: category })
})

module.exports = router;
