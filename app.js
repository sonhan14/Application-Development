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

const userController = require("./controllers/customer");
app.use("/customer", userController);
app.use("/", userController); 


const adminController = require("./controllers/admin");
app.use("/admin", adminController);

const async = require("hbs/lib/async");
const { cookie } = require("express/lib/response");
const res = require("express/lib/response");

// app.get('/', requiresLogin, (req, res) => {
//     const user = req.session['user']
//     res.render('index', {userInfo : user})
// })


app.get('/', async (req, res) => {
    const truyen = await dbHandler.searchObjectbyCategory("Book","61e570c7ba41b21dee1346b3")
    const ITbook = await dbHandler.searchObjectbyCategory("Book", "61e570ddba41b21dee1346b4")
    const searchInput = req.query.search
    if (isNaN(Number.parseFloat(searchInput)) == false) {
        await SearchObject(searchInput, res, truyen, ITbook,dbHandler.searchObjectbyPrice, "Book", Number.parseFloat(searchInput), " VND")
    } else {
        await SearchObject(searchInput, res, truyen, ITbook,dbHandler.searchObjectbyName, "Book", searchInput, "")
    }

})
async function SearchObject(searchInput, res, truyen, ITbook, dbFunction, collectionName, searchInput, mess) {
    const resultSearch = await dbFunction(collectionName, searchInput)
    if (searchInput == null) {
        res.render('home', { truyens: truyen, ITbooks: ITbook })
    }
    else {
        if (resultSearch.length != 0) {
            res.render('home', { truyens: truyen, ITbooks: ITbook })
        } else {
            const message = ("Not found " + searchInput + mess)
            res.render('home', { truyens: truyen, ITbooks: ITbook, errorSearch: message })
        }
    }
}

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', async (req, res) => {
    const name = req.body.txtName
    const pass = req.body.txtPass
    const role = await dbHandler.checkUserRole(name, pass);
    // const user = await dbHandler.checkUser(name, pass)
    // if (user == null) { res.render('login', { errorMsg: "Login failed!" }) }
    console.log(role)
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
