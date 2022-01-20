const express = require('express')
const async = require('hbs/lib/async')
const dbHandler = require('../databaseHandler')
const router = express.Router()


router.post("/", async (req, res) => {
    //xem nguoi dung mua gi: Milk hay Coffee
    const product = req.body.bookID
    //lay gio hang trong session
    let cart = req.session["cart"]
    //chua co gio hang trong session, day se la sp dau tien
    if (!cart) {
        let dict = {}
        dict[product] = 1
        req.session["cart"] = dict
        console.log("Ban da mua:" + product + ", so luong: " + dict[product])
    } else {
        dict = req.session["cart"]
        //co lay product trong dict
        var oldProduct = dict[product]
        //kiem tra xem product da co trong Dict
        if (!oldProduct)
            dict[product] = 1
        else {
            dict[product] = parseInt(oldProduct) + 1
        }
        req.session["cart"] = dict
        console.log("Ban da mua:" + product + ", so luong: " + dict[product])
    }
    })

router.get("/", async (req, res) => {
    const addedBook = await dbHandler.getAll("Order")
    res.render('ShoppingCart', { books: addedBook })
})


module.exports = router;