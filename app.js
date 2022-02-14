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

app.get("/logout", (req, res) => {
  req.session.user = null;
  res.redirect("/");
});

app.post("/login", async (req, res) => {
  const name = req.body.txtName;
  const pass = req.body.txtPass;
  const role = await dbHandler.checkUserRole(name, pass);
  console.log("Username: " + name);
  console.log("Password: " + pass);
  console.log("Role: " + req.body.Role);
  if (role == -1) {
    res.render("login", { errorMsg: "Login failed!" });
  } else {
    if (req.body.Role == role) {
      req.session.user = {
        name: name,
        role: role,
      };
      console.log(req.session.user);
      req.session["cart"] = null;
      if (role == "Customer") {
        res.redirect("/");
      } else {
        res.redirect("/admin");
      }
    } else {
      res.render("login", { errorMsg: "not auth!!" });
    }
  }
});

const shoppingCart = require("./controllers/cart");
app.use("/shoppingCart", shoppingCart);

app.get("/search", (req, res) => {
  res.render("search");
});

const customerController = require("./controllers/customer");
app.use("/", customerController);

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/adp", (req, res) => {
  res.render("Admin_Product");
});
app.get("/adc", (req, res) => {
  res.render("Admin_Customer");
});
app.get("/Pushase", (req, res) => {
  res.render("Pushase");
});

app.get("/profile", (req, res) => {
  res.render("profile");
});
app.get("/UpDateProfile", (req, res) => {
  res.render("UpDateProfile");
});
//cac request co chua /admin se di den controller customer
const userController = require("./controllers/customer");
app.use("/", userController);

//cac request co chua /admin se di den controller admin
const adminController = require("./controllers/admin");
app.use("/admin", adminController);

const feedbackController = require("./controllers/feedback");
app.use("/feedback", feedbackController);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log("Server is running! " + PORT);
