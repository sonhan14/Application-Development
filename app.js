const express = require("express");
const app = express();
const dbHandler = require("./databaseHandler");
const session = require ('express-session')
// const { checkUserRole } = require('./databaseHandler')

app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session({
    secret: 'huong123@@##&&',
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    saveUninitialized: false,
    resave: false
}))

const userController = require("./controllers/customer");
app.use("/", userController)

const adminController = require("./controllers/admin");
app.use("/admin", adminController);

const async = require("hbs/lib/async");
const { cookie } = require("express/lib/response");
const res = require("express/lib/response");

// app.get('/', requiresLogin, (req, res) => {
//     const user = req.session['user']
//     res.render('index', {userInfo : user})
// })

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', async (req, res) => {
    const name = req.body.txtName
    const pass = req.body.txtPass
    const role = await dbHandler.checkUserRole(name, pass);
    // const user = await dbHandler.checkUser(name, pass)
    // if (user == null) { res.render('login', { errorMsg: "Login failed!" }) }
    if (role == -1){ res.render('login')}
    else { 
        req.session.user = {
            name : name,
            role : role
        }
        res.redirect('/')
    }
})

app.post('/doRegister', async (req, res) => {
    const nameIn = req.body.name;
    const passIn = req.body.password;
    const role = await checkUserRole(nameIn, passIn);
    const found = await dbHandler.checkUserRegister(nameInput);
    if (found) {
        res.render('register', { passError: 'Username already exists!!!' })
    }

    if (passInput.length < 10) {
        res.render('register', { passError: 'Password must  more than 10 characters' })
    }
    const newUser = { username: nameIn, password: passIn };
    await dbHandler.insertOneIntoCollection("users", newUser);
    res.render('login');
})



const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log("Server is running! " + PORT);
