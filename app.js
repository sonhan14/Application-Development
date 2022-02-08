const express = require("express");
const app = express();
const dbHandler = require("./databaseHandler");
const session = require("express-session");

app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  session({
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

app.get('/logout', (req, res) => {
  req.session.user = null;
  res.redirect('/');
  
})





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
            req.session["cart"] = null;
            res.redirect("/");
        } else {
            res.render('login', { errorMsg: "not auth!!" })
        }
      }
    })

const shoppingCart = require("./controllers/cart");
app.use("/shoppingCart", shoppingCart);

app.get('/search', (req,res)=>{
  res.render('search')
})

const customerController = require("./controllers/customer");
app.use("/", customerController);

app.get("/login", (req, res) => {
  res.render("login");
})

//cac request co chua /admin se di den controller customer
const userController = require("./controllers/customer");
app.use("/", userController);

//cac request co chua /admin se di den controller admin
const adminController = require("./controllers/admin");
const { ObjectId } = require("mongodb");
app.use("/admin", adminController);

app.get("/feedback", (req, res) => {
  res.render("feedback", {query: req.query.id});
})
app.post("/feedback", (req,res) => {
  console.log(req.body);
  dbHandler.insertObject("Feedback", req.body);
  res.send("Ok");
})

app.get("/feedbackManage", async (req,res) => {
  const result = await dbHandler.getAll("Feedback");
  const product = await dbHandler.getAll("Book");

  result.forEach(e => {
    if(ObjectId(e._id).toString() === result[0].id) {
      console.log("fb Ok")
    }
  })
  res.render("feedbackManagement", {result});
})

const PORT = process.env.PORT || 5000;
app.listen(PORT)
console.log("Server is running! " + PORT)