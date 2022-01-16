const express = require("express");
const app = express();
const dbHandler = require("./databaseHandler");
const session = require ('express-session')

app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session({
    secret: 'huong123@@##&&',
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    saveUninitialized: false,
    resave: false
}))


app.post('/login', async (req, res) => {
    const name = req.body.txtName
    const pass = req.body.txtPass
    const role = await checkUserRole(name, pass)
    if (role == -1){ req.render('login')}
    else { 
        req.session.role == 'user'
    }
    //I'll continue because I'm so sleepy now
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
const { cookie } = require("express/lib/response");
app.use("/manageCustomerOrder", manageController);




const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log("Server is running! " + PORT);
