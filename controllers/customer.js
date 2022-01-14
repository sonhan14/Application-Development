const express = require('express')
const {searchObjectbyPrice, searchObjectbyName, insertObject, getAll, deleteDocumentById, getDocumentById, updateDocument, } = require('../databaseHandler')
const router = express.Router()

router.get('/',async(req,res)=>{
    var result = await getAll("Book")
    const checkInput = req.body.search
    const searchInput = req.query.search
    const resultSearch = await searchObjectbyName("Book", searchInput)
    if(isNaN(Number.parseFloat(checkInput)) == false)
    {
        resultSearch = await searchObjectbyPrice("Book", searchInput)
    }
    
    if(searchInput == null)
    {
        res.render('index',{books:result})
    }
    else{
        if(resultSearch.length != 0)
        {
            res.render('index', {books: resultSearch})
        }else{
            const message = ("Not found " + searchInput)
            res.render('index', {books: result, errorSearch: message})
        }
    }
})

module.exports = router;