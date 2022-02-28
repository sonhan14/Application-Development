const express = require("express");
const app = express();
const dbHandler = require("./databaseHandler");
const session = require("express-session");
const bcrypt = require("bcrypt");

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
  const user = await dbHandler.checkUserLogin(name);
  if (user == -1) {
    res.render("login", { errorMsg: "Not found UserName!!" });
  } else {
    const validPass = await bcrypt.compare(pass, user.password);
    if (validPass) {
      const role = await dbHandler.checkUserRole(name);
      if (role == -1) {
        res.render("login", { errorMsg: "Login failed!" });
      } else {
        if (req.body.Role == role) {
          req.session.user = {
            name: name,
            role: role,
          };
          console.log("Loged in with: ");
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
    } else {
      res.render("login", { errorMsg: "Incorrect password!!" });
    }
  }
});

const shoppingCart = require("./controllers/cart");
app.use("/shoppingCart", shoppingCart);

const customerController = require("./controllers/customer");
app.use("/", customerController);

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/search", (req, res) => {
  res.render("search");
});

app.post("/register", async (req, res) => {
  const userName = req.body.txtUser;
  const mail = req.body.txtMail;
  const phone = req.body.txtPhone;
  const pass = req.body.txtPass;
  const rePass = req.body.txtRePass;
  const role = req.body.Role;
  const hashPass = await bcrypt.hash(pass, 10);
  const existedUser = await dbHandler.checkUserLogin(userName);
  if (existedUser == -1) {
    const validPass = await bcrypt.compare(rePass, hashPass);
    if (validPass) {
      const newUser = {
        userName: userName,
        email: mail,
        phone: phone,
        role: role,
        password: hashPass,
      };
      await dbHandler.insertObject("Users", newUser);
      res.render("register");
    } else {
      res.render("register", { errorMsg: "Password is not match" });
    }
  } else {
    res.render("register", { errorMsg: "Username already used" });
  }
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
const async = require("hbs/lib/async");
app.use("/feedback", feedbackController);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log("Server is running! " + PORT);
