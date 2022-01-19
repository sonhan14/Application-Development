const express = require('express')
const async = require('hbs/lib/async')
const {searchObjectbyCategory, searchObjectbyPrice, searchObjectbyName, insertObject, getAll, deleteDocumentById, getDocumentById, updateDocument, } = require('../databaseHandler')
const router = express.Router()


router.post("/",async (req,res)=> {
    const id = req.query.bookID
    const qty = req.body.qty
    await updateDocument(newOrder._id, updateDocument,"Order")
    res.redirect('/')
})

router.get("/",async (req,res)=>{
    const addedBook = await getAll("Order")
    res.render('shoppingcart',{books: addedBook})
})

module.exports = router;