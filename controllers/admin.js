const express = require('express')
const { insertObject, getAll, deleteDocumentById, getDocumentById, updateDocument, } = require('../databaseHandler')
const router = express.Router()
const dbHandler = require("../databaseHandler");


//neu request la: /admin
router.get('/',(req,res)=>{
    res.render('adminIndex')
})

//neu request la: /admin/addUser
router.get('/addUser',(req,res)=>{
    res.render('addUser')
})

//Submit add User
router.post('/addUser',(req,res)=>{
    const name = req.body.txtName
    const role = req.body.Role
    const pass= req.body.txtPassword
    const objectToInsert = {
        userName: name,
        role:role,
        password: pass
    }
    insertObject("Users",objectToInsert)
    res.render('adminIndex')
})

router.get("/manageCustomerOrder", async (req, res) => {
    let result = await dbHandler.getAll("order");
    result.forEach((element) => (element.time = element.time.toLocaleString("vi")));
    res.render("manageCustomerOrder", { demo: result, next: true });
});

router.get("/:sortBy", async (req, res) => {
    let result = await dbHandler.getAll("order");
    if (req.params.sortBy === "today") {
        let today = new Date().toLocaleDateString("vi");
        result = result.filter((item) => {
            return item.time.toLocaleDateString("vi") === today
        });
        result.forEach((element) => {
            element.time = element.time.toLocaleString("vi");
        });
        res.render("manageCustomerOrder", { demo: result });
    } else if (req.params.sortBy === "week") {
        let today = new Date();
        let week = new Date(today.setDate(today.getDate() - 7));
        result = result.filter((item) => item.time > week);
        result.forEach((element) => (element.time = element.time.toLocaleString("vi")));
        res.render("manageCustomerOrder", { demo: result });
    }
    else {
        res.redirect("/manageCustomerOrder");
    }
});

module.exports = router;