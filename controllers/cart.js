const express = require('express')
const async = require('hbs/lib/async')
const dbHandler = require('../databaseHandler')
const router = express.Router()
router.use(express.static("public"));



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

// router.post('/',(req,res)=>{
//     //xem nguoi dung mua gi: Milk hay Coffee
//     const product = req.body.bookID
//     //lay gio hang trong session
//     let cart = req.session["cart"]
//     //chua co gio hang trong session, day se la sp dau tien
//     if(!cart){
//         let dict = {}
//         dict[product] = 1
//         req.session["cart"] = dict
//         console.log("Ban da mua:" + product + ", so luong: " + dict[product])
//     }else{
//         dict = req.session["cart"]
//         //co lay product trong dict
//         var oldProduct = dict[product]
//         //kiem tra xem product da co trong Dict
//         if(!oldProduct)
//             dict[product] = 1
//         else{
//             dict[product] = parseInt(oldProduct) +1
//         }
//         req.session["cart"] = dict
//         console.log("Ban da mua:" + product + ", so luong: " + dict[product])
//     }
//     res.redirect('/details?id=' + product)
// }
// )

router.post("/", async (req, res) => {
    const bookID = req.body.bookID
    const book = await dbHandler.getDocumentById(bookID, "Book")
    let cart = req.session["cart"]
    //chua co gio hang trong session, day se la sp dau tien
    if (!cart) {
        let dict = { books: [], totalPrice: book.price };
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
    res.redirect('/details?id=' + bookID)
})

router.get('/viewCart', (req, res) => {
    const cart = req.session["cart"]
    if (cart) {
        res.render('ShoppingCart', { order: cart})
    }
    
})


module.exports = router;