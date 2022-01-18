const express = require('express')
const async = require('hbs/lib/async')
const {searchObjectbyCategory, searchObjectbyPrice, searchObjectbyName, insertObject, getAll, deleteDocumentById, getDocumentById, updateDocument, } = require('../databaseHandler')
const router = express.Router()



module.exports = router;
