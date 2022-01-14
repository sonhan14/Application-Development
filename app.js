const express = require("express");
const app = express();
const dbHandler = require("./databaseHandler");

app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: true }));
//hellotest
app.use(express.static("public"));

const userController = require("./controllers/customer");
app.use("/", userController);

const adminController = require("./controllers/admin");
//cac request co chua /admin se di den controller admin
app.use("/admin", adminController);

//hello 12344

const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log("Server is running! " + PORT);
