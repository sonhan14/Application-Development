const express = require("express");
const app = express();
const dbHandler = require("./databaseHandler");
const session = require("express-session");

app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session({
    secret: "huong123@@##&&",
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    saveUninitialized: false,
    resave: false,
})
);

const customerController = require("./controllers/customer");
app.use("/", customerController);

// app.get('/', requiresLogin, (req, res) => {
//     const user = req.session['user']
//     res.render('index', {userInfo : user})
// })

const shoppingCart = require("./controllers/cart");
app.use("/shoppingCart", shoppingCart);



app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", async (req, res) => {
    const name = req.body.txtName;
    const pass = req.body.txtPass;
    const role = await dbHandler.checkUserRole(name, pass);
    console.log("Username: " + name);
    console.log("Password: " + pass);
    console.log("Role: " + req.body.Role);
    if (role == -1) { res.render('login', { errorMsg: "Login failed!" }) }
    else {
        if(req.body.Role == role) {
            req.session.user = {
                name: name,
                role: role,
            };
            console.log(req.session.user);
            res.redirect("/");
        } else {
            res.render('login', { errorMsg: "not auth!!" })
        }
    }
});


//cac request co chua /admin se di den controller admin
const adminController = require("./controllers/admin");
app.use("/admin", adminController);


const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log("Server is running! " + PORT);
