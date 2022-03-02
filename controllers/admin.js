const express = require('express')
const { insertObject, getAll, deleteDocumentById, getDocumentById, updateDocument, } = require('../databaseHandler')
const router = express.Router()
const dbHandler = require("../databaseHandler");
const { ObjectId } = require("mongodb");
const async = require('hbs/lib/async');
router.use(express.static("public"));

//middleware
router.use((req, res, next) => {
    const { user } = req.session; //same as: user = req.session.user
    if (user) {
        if (user.role == "Admin") {
            next("route");
        } else { res.sendStatus(404); }
    } else {
        res.redirect('/login');
    }
})


//neu request la: /admin
router.get('/', async (req, res) => {
    // if (req.query.sortBy == "today") {
    //     res.redirect("/admin/today");
    // } else if (req.query.sortBy == 'week') {
    //     res.redirect("/admin/week");
    // } else {
    //     const customerOrder = await dbHandler.getAll("Customer Order")
    //     customerOrder.forEach((element) => {
    //         element.time = element.time.toLocaleString("vi");
    //         element.itemString = "";
    //         element.item.forEach(e => {//tao bien itemString de hien thi cac phan tu trong element (them item va amount)
    //             element.itemString += e.item + "x" + e.amount + " ";
    //         })
    //     });
        res.render('adminPage', {
            // customerOrder: customerOrder,
            user: req.session.user
        })
    // }
})

//neu request la: /admin/addUser
router.get('/addUser', (req, res) => {
    res.send("This is add user page!")
    // res.render('addUser')

})

router.get("/feedbackManage", async (req, res) => {
    let result = await dbHandler.getAllFeedback();
    // res.render("feedbackManagement", { result });
    res.render('adminPage', { feedback: result, user: req.session.user })
});

router.get('/feedbackManage/delete', async (req, res) => {
    console.log(req.query);
    await dbHandler.deleteDocumentById('Feedback', req.query.id);
    res.redirect('/admin/feedbackManage');
})

router.get("/feedbackManage/:day", async (req, res, next) => {
    let result = await dbHandler.getAllFeedback();
    const today = new Date();
    if (req.params.day === "today") {
        result = result.filter((e) => new Date(e.time).toDateString() === today.toDateString());
        res.render("adminPage", {
            feedback: result,
            user: req.session.user,
        });
    } else if (req.params.day === "2days") {
        const queryDay = new Date(today.setDate(today.getDate() - 2));
        result = result.filter((e) => new Date(e.time) > queryDay);
        res.render("adminPage", {
            feedback: result,
            user: req.session.user,
        });
    } else if (req.params.day === "2weeks") {
        const queryDay = new Date(today.setDate(today.getDate() - 14));
        result = result.filter((e) => new Date(e.time) > queryDay);
        res.render("adminPage", {
            feedback: result,
            user: req.session.user,
        });
    } else if (req.params.day === "2months") {
        const queryDay = new Date(today.setMonth(today.getMonth() - 2));
        result = result.filter((e) => new Date(e.time) > queryDay);
        res.render("adminPage", {
            feedback: result,
            user: req.session.user,
        });
    } else {
        next("route");
    }
});

router.get("/feedbackManage/specifyDay/:day", async (req, res) => {
    let result = await dbHandler.getAllFeedback();
    const specifyDay = new Date(req.params.day).toDateString();
    result = result.filter((e) => new Date(e.time).toDateString() === specifyDay);
    res.render("adminPage", { feedback: result, user: req.session.user });
});

router.get('/feedbackManage/bookName', async (req, res) =>{
    let result = await dbHandler.getAllFeedback();
    const arr = result.filter(element => {
        return element.name === req.query.bookName;
    })
    res.render('adminPage', {feedback: arr})
})

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

router.get('/customer', (req, res) => {
    res.render("Admin_Customer")
});

router.get('/product', async (req, res) => {
    const book = await dbHandler.getAll("Book")

    res.render("Admin_Product", {book:book})
    
});
router.get('/addbook', async (req, res)=> {
    res.render("AddBook")
})
router.post('/addbook', async (req, res) => {
    const nameInput = req.body.txtName
    const priceInput = req.body.txtPrice
    const image = req.body.txtImage
    const Description = req.body.txtDescription
    const Category = req.body.Category
    const CategoryID = await dbHandler.getDocumentByName("Category" , Category)
    const newBook = {name:nameInput, des:Description, price:Number.parseFloat(priceInput), pic:image, category:CategoryID._id}
    await dbHandler.insertObject("Book", newBook)
    res.redirect('/admin/addbook')
})
router.get('/deletebook', async (req, res) => {
    const id = req.query.id
    console.log(id)
    await dbHandler.deleteDocumentById("Book", id)
    res.redirect('/admin/product')
})
router.get('/updatebook', async (req, res) => {
    const id = req.query.id
    const result = await getDocumentById(id,"Book")
    res.render('updatebook', {book:result})
})
router.post('/updatebook', async (req, res) => {
    const nameInput = req.body.txtName
    const priceInput = req.body.txtPrice
    const image = req.body.txtImage
    const Description = req.body.txtDescription
    const Category = req.body.Category
    const CategoryID = await dbHandler.getDocumentByName("Category" , Category)
    const UpdateValue = {$set: {name:nameInput, des:Description, price:Number.parseFloat(priceInput), pic:image, category:CategoryID._id}}
    const id = req.body.txtid
    console.log(UpdateValue)
    console.log(id)
    await dbHandler.updateDocument(id, UpdateValue,"Book")
    res.redirect('/admin/product')
})
router.get('/updateprofile', async (req, res)=>{
    const id = req.query.id
    const result = await getDocumentById(id,"Update")
    res.render('updateprofile', {updateprofile:result})
})
router.post('/updateprofile', async (req, res)=>{
    const urernameInput = req.body.txtUsername
    const emailInput = req.body.txtEmail
    const phoneInput = req.body.txtPhone
    const passwordInput = req.body.txtPassword
    const id = req.body.txtid
    const UpdateValue = {$set: {username:usernameInput, email:Email, phone:Phone, password:Password}}
    console.log(UpdateValue)
    await dbHandler.updateDocument(id, UpdateValue,"Profile")
    res.redirect('admin')
})


// router.get("/admin", async (req, res) => {
//     let result = await dbHandler.getAll("Customer Order");
//     result.forEach((element) => (element.time = element.time.toLocaleString("vi")));
//     res.render("adminPage", { demo: result, next: true });
// });


router.get("/:sortBy", async (req, res, next) => {
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
        next("route");
    }
});

router.get('/manageCustomer', async (req, res) => {
    result = await dbHandler.getAll("Users");
    const arr = result.filter((element) => {
        return element.role === 'Customer'
    });
    arr.forEach((element, index) => {
        element.index = index+1;
        delete element.password;
        delete element.role;
    })
    console.log(arr);
    res.render('adminPage', { Customer: arr})
    
})

router.get('/deleteCustomer/:id', async(req, res) => {
    // console.log(req.params.id)
    // await dbHandler.deleteDocumentById('Users', req.params.id);
    // res.redirect('/admin/manageCustomer')
    res.send("Delete customer by ID" + req.params.id)
})
router.get('/deleteCustomer', async(req, res) => {
    res.send("deleteCustomer")
})

//view profile
exports.getProfile = async (req, res) => {
    let aTrainee = await trainee.findOne({ email: req.session.email })
    res.render('traineeProfileUpdate', { aTrainee: aTrainee, loginName: req.session.email });
}

//update profile
exports.updateProfile = async (req, res) => {
    let id = req.body.id;
    let aTrainee = await trainee.findById(id);
    if (req.file) {
        aTrainee.img = req.file.filename;
    }
    aTrainee.dateOfBirth = new Date(req.body.date);
    aTrainee.education = req.body.education;
    aTrainee = await aTrainee.save();
    res.redirect('/trainee');
}




module.exports = router;