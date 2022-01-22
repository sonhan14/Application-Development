const express = require('express')
const async = require('hbs/lib/async')
const dbHandler = require('../databaseHandler')
const router = express.Router()
router.use(express.static("public"));



router.use((req, res, next) => {
    console.log(req.session);
    const { user } = req.session;
    if (user) {
        if (user.role == 'Customer') {
            next("route");
        } else { res.sendStatus(404); }
    } else {
        res.redirect('/login');
    }
})

router.post("/", async (req, res) => {
    const bookID = req.body.bookID
    const book = await dbHandler.getDocumentById(bookID, "Book")
    const orderDB = await dbHandler.getCart(req.session.user.name)
    if (orderDB == null) {
        let cart = req.session["cart"]
        //chua co gio hang trong session, day se la sp dau tien
        if (!cart) {
            let dict = { user: req.session.user.name, books: [], totalPrice: book.price };
            book.qty = 1;
            book.money = book.price * book.qty
            dict.books.push(book);
            req.session["cart"] = dict
            console.log(dict)
        } else {
            dict = req.session["cart"]
            var oldBookIndex = dict.books.findIndex(b => b._id == book._id)
            if (oldBookIndex == -1) {
                book.qty = 1;
                book.money = book.price * book.qty
                dict.books.push(book);
            }
            else {
                const oldBook = dict.books[oldBookIndex];
                oldBook.qty += 1;
                oldBook.money = oldBook.price * oldBook.qty
            }
            dict.totalPrice += book.price;
            req.session["cart"] = dict
            console.log(dict)
        }
        await dbHandler.updateCart(req.session.user.name, req.session["cart"])
        res.redirect('/details?id=' + bookID)
    }

    else {
        let cart = req.session["cart"]
        if (!cart) {
            let dict = orderDB;
            var oldBookIndex = dict.books.findIndex(b => b._id == book._id)
            if (oldBookIndex == -1) {
                book.qty = 1;
                book.money = book.price * book.qty
                dict.books.push(book);
            }
            else
            {
                const oldBook = dict.books[oldBookIndex];
                oldBook.qty += 1;
                oldBook.money = oldBook.price * oldBook.qty
            }
            dict.totalPrice += book.price;
            req.session["cart"] = dict
            console.log(dict)
        } else {
            dict = req.session["cart"]
            var oldBookIndex = dict.books.findIndex(b => b._id == book._id)
            if (oldBookIndex == -1) {
                book.qty = 1;
                book.money = book.price * book.qty
                dict.books.push(book);
            }
            else {
                const oldBook = dict.books[oldBookIndex];
                oldBook.qty += 1;
                oldBook.money = oldBook.price * oldBook.qty
            }
            dict.totalPrice += book.price;
            req.session["cart"] = dict
            console.log(dict)
        }
        await dbHandler.updateCart(req.session.user.name, req.session["cart"])
        res.redirect('/details?id=' + bookID)
    }
})

router.get('/viewCart', async (req, res) => {
    const cart = req.session["cart"]
    if (cart) {
        res.render('ShoppingCart', { order: cart, user: req.session.user })
    }
    else {
        const orderDB = await dbHandler.getCart(req.session.user.name)
        console.log(orderDB);
        res.render('ShoppingCart', { order: orderDB, user: req.session.user })
    }
//how?

})
module.exports = router;