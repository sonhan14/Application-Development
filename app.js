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

// app.get('/', requiresLogin, (req, res) => {
//     const user = req.session['user']
//     res.render('index', {userInfo : user})
// })

app.get("/", async (req, res) => {
    const truyen = await dbHandler.searchObjectbyCategory(
        "Book",
        "61e570c7ba41b21dee1346b3"
    );
    const ITbook = await dbHandler.searchObjectbyCategory(
        "Book",
        "61e570ddba41b21dee1346b4"
    );
    const searchInput = req.query.search;
    if (isNaN(Number.parseFloat(searchInput)) == false) {
        await SearchObject(
            searchInput,
            res,
            truyen,
            ITbook,
            dbHandler.searchObjectbyPrice,
            "Book",
            Number.parseFloat(searchInput),
            " VND"
        );
    } else {
        await SearchObject(
            searchInput,
            res,
            truyen,
            ITbook,
            dbHandler.searchObjectbyName,
            "Book",
            searchInput,
            ""
        );
    }
});
async function SearchObject(
    searchInput,
    res,
    truyen,
    ITbook,
    dbFunction,
    collectionName,
    searchInput,
    mess
) {
    const resultSearch = await dbFunction(collectionName, searchInput);
    if (searchInput == null) {
        res.render("index", { truyens: truyen, ITbooks: ITbook });
    } else {
        if (resultSearch.length != 0) {
            res.render("index", { truyens: truyen, ITbooks: ITbook });
        } else {
            const message = "Not found " + searchInput + mess;
            res.render("index", {
                truyens: truyen,
                ITbooks: ITbook,
                errorSearch: message,
            });
        }
    }
}

app.post("/login", async (req, res) => {
    const name = req.body.txtName;
    const pass = req.body.txtPass;
    const role = await dbHandler.checkUserRole(name, pass);
    console.log(role);
    if (role == -1) {
        res.render("login");
    } else {
        console.log(role)
        if (role == -1) { res.render('login', { errorMsg: "Login failed!" }) }
        else {
            req.session.user = {
                name: name,
                role: role,
            };
            res.redirect("/");
        }
    }
});

app.get("/login", (req, res) => {
    res.render("login");
});

//cac request co chua /admin se di den controller customer
const userController = require("./controllers/customer");
app.use("/", userController);

//cac request co chua /admin se di den controller admin
const adminController = require("./controllers/admin");
app.use("/admin", adminController);


const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log("Server is running! " + PORT);
