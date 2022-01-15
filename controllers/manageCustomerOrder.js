const express = require('express')
const async = require('hbs/lib/async')
const dbHandler = require("../databaseHandler");
const router = express.Router()

router.get("/", async (req, res) => {
    let result = await dbHandler.getAll("order");
    result.forEach((element) => (element.time = element.time.toLocaleString("vi")));
    res.render("manageCustomerOrder", { demo: result, next: true });
});

router.get("/:sortBy", async (req, res) => {
    let result = await dbHandler.getAll("order");
    if (req.params.sortBy === "today") {
        let today = new Date().toLocaleDateString("vi");
        result = result.filter((item) => {
            return item.time.toLocaleDateString("vi") === today
        });
        result.forEach((element) => {
            element.time = element.time.toLocaleString("vi");
        });
        res.render("manageCustomerOrder", { demo: result });
    } else if (req.params.sortBy === "week") {
        let today = new Date();
        let week = new Date(today.setDate(today.getDate() - 7));
        result = result.filter((item) => item.time > week);
        result.forEach((element) => (element.time = element.time.toLocaleString("vi")));
        res.render("manageCustomerOrder", { demo: result });
    }
    else {
        res.redirect("/");
    }
});

module.exports = router;