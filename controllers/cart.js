const express = require('express')
const async = require('hbs/lib/async')
const dbHandler = require('../databaseHandler')
const router = express.Router()
router.use(express.static("public"));

const session = require("express-session");

router.use(session({
    secret: "huong123@@##&&",
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    saveUninitialized: false,
    resave: false,
})
);

// router.use((req, res, next) => {
//     console.log(req.session);
//     const { user } = req.session;
//     if (user) {
//         if (user.role == 'Customer') {
//             next("route");
//         } else { res.sendStatus(404); }
//     } else {
//         res.redirect('/login');
//     }
// })

// router.get("/", (req, res) => {
//     res.send("This is customer page!")
// });

router.post("/", async (req, res) => {
    const bookID = req.body.bookID
    const book = await dbHandler.getDocumentById(bookID,"Book")
    let cart = req.session["cart"]
    //chua co gio hang trong session, day se la sp dau tien
    if (!cart) {
        let dict = { books: [], totalPrice: 0 };
        book.qty = 1;
        dict.books.push(book);
        req.session["cart"] = dict
        console.log(dict)
    } else {
        dict = req.session["cart"]
        //co lay product trong dict
        var oldBookIndex = dict.books.findIndex(b => b._id == book._id)
        //kiem tra xem product da co trong Dict
        if (oldBookIndex == -1)
        {
            book.qty = 1;
            // dict[book] = 1
            dict.books.push(book);
        }
        else {
            const oldBook = dict.books[oldBookIndex];
            oldBook.qty += 1;
        }
        req.session["cart"] = dict
        console.log("cap nhat thanh cong")
        console.log(dict)
    
    }
})

router.get('/viewCart', (req, res) => {
    const cart = req.session["cart"]
    //Mot array chua cac san pham trong gio hang
    let spDaMua = []
    //neu khach hang da mua it nhat 1 sp
    if (cart) {
        const dict = req.session["cart"]
        for (var key in dict) {
            spDaMua.push({ tensp: key, soLuong: dict[key] })
        }
    }
    res.render('ShoppingCart', { books: spDaMua })
})


module.exports = router;