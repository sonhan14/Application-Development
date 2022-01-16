const express = require("express");
const app = express();
const dbHandler = require("./databaseHandler");

app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.post('/login', async (req, res) => {
    const name = req.body.txtName
    const pass = req.body.txtPass
    const role = await checkUserRole(name, pass)
    if (role == -1){ req.render('login')}
    else { res.render('index')}
})





//cac request co chua /admin se di den controller customer
const userController = require("./controllers/customer");
app.use("/", userController);

//cac request co chua /admin se di den controller admin
const adminController = require("./controllers/admin");
app.use("/admin", adminController);


//cac request co chua /admin se di den controller admin
const loginControler = require('./controllers/login');
app.use("/login", loginControler)

const manageController= require("./controllers/manageCustomerOrder");
const async = require("hbs/lib/async");
app.use("/manageCustomerOrder", manageController);




const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log("Server is running! " + PORT);
