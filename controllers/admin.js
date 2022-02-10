const express = require('express')
const { insertObject, getAll, deleteDocumentById, getDocumentById, updateDocument, } = require('../databaseHandler')
const router = express.Router()
const dbHandler = require("../databaseHandler");
const { ObjectId } = require("mongodb");
const async = require('hbs/lib/async');
const e = require('express');
router.use(express.static("public"));

//middleware
router.use((req, res, next) => {
    const { user } = req.session; //same as: user = req.session.user
    if (user) {
        if (user.role == "admin") {
            next("route");
        } else { res.sendStatus (404); }
    } else {
        res.redirect('/login');
    }
})


//neu request la: /admin
router.get('/', async (req, res) => {
    if (req.query.sortBy == "today") {
        res.redirect("/admin/today");
    }else if (req.query.sortBy == 'week'){
        res.redirect("/admin/week");
    }else {
        const customerOrder = await dbHandler.getAll("Customer Order")
        customerOrder.forEach((element) => (element.time = element.time.toLocaleString("vi")));
        res.render('adminPage',  { customerOrder: customerOrder, user : req.session.user})
        
    }

    
})

//neu request la: /admin/addUser
router.get('/addUser', (req, res) => {
    res.send("This is add user page!")
    // res.render('addUser')
    
})

router.get("/feedbackManage", async (req, res) => {
    const result = await dbHandler.getAll("Feedback");

    // res.render("feedbackManagement", { result });
    res.render('adminPage', {feedback: result, user : req.session.user})
  });

//Submit add User
router.post('/addUser', (req, res) => {
    const name = req.body.txtName
    const role = req.body.Role
    const pass = req.body.txtPassword
    const objectToInsert = {
        userName: name,
        role: role,
        password: pass
    }
    insertObject("Users", objectToInsert)
    res.render('adminIndex')
})

router.get('/customer', (req,res)=>{
    res.render("Admin_Customer")
});

router.get('/product', (req,res)=>{
    res.render("Admin_Product")
});

// router.get("/admin", async (req, res) => {
//     let result = await dbHandler.getAll("Customer Order");
//     result.forEach((element) => (element.time = element.time.toLocaleString("vi")));
//     res.render("adminPage", { demo: result, next: true });
// });


router.get("/:sortBy", async (req, res) => {
    let result = await dbHandler.getAll("Customer Order");
    if (req.params.sortBy === "today") {
        let today = new Date().toLocaleDateString("vi");
        result = result.filter((item) => {
            return item.time.toLocaleDateString("vi") === today
        });
        result.forEach((element) => {
            element.time = element.time.toLocaleString("vi");
        });
        res.render("adminPage", { customerOrder: result });
    } else if (req.params.sortBy === "week") {
        let today = new Date();
        let week = new Date(today.setDate(today.getDate() - 7));
        result = result.filter((item) => item.time > week);
        result.forEach((element) => (element.time = element.time.toLocaleString("vi")));
        res.render("adminPage", { customerOrder: result });
    }
    else if (req.params.sortBy === "delete") {
        let { id } = req.query; // same as: let id = req.query.id;
        let result = await dbHandler.deleteOne("Customer Order", { _id: ObjectId(id) });
        if (result) {
            res.redirect("/admin");
        } else {
            res.send("Cancel error!");
        }
    }
    else {
        res.redirect("/admin");
    }
});

module.exports = router;