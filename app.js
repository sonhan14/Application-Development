const express = require("express");
const app = express();
const dbHandler = require("./databaseHandler");
const session = require('express-session');
app.use(session({
  //setting for session
  resave: true,
  saveUninitialized: true,
  secret: 'mysecret12345@@@@@',
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const adminController = require("./controllers/admin");
//cac request co chua /admin se di den controller admin
app.use("/admin", adminController);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/order", (req, res) => {
  res.render("order");
});

app.get('/login', (req, res) => {
  res.render('login');
})

app.post('/doLogin', async (req, res) => {
  const nameInput = req.body.name;
  const passInput = req.body.password;
  const found = await dbHandler.checkUser(nameInput, passInput);
  if (found) {
      req.session.username = nameInput;
      res.render('index', { loginName: nameInput })
  } else {
      res.render('login', { errorMsg: "Login failed!" })
  }
})


app.get("/getOrder", (req, res) => {
  req.query.time = new Date();
  console.log(req.query);
  dbHandler.insertObject("order", req.query);
  res.send("Done");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log("Server is running! " + PORT);
