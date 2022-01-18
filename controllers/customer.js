const express = require('express')
const async = require('hbs/lib/async')
const {searchObjectbyCategory, searchObjectbyPrice, searchObjectbyName, insertObject, getAll, deleteDocumentById, getDocumentById, updateDocument, } = require('../databaseHandler')
const router = express.Router()

router.get('/details',async(req, res) => {
    const id = req.query.id
    const result = await getDocumentById(id,"Book")
    const category = await getDocumentById(result.category,"Category")
    res.render('product_Detail', {details: result, category: category})
})


module.exports = router;
