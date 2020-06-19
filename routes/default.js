const router = require('express').Router();
const fs = require('fs');

const header = fs.readFileSync("public/templates/_partials/header.html", "utf8");
const footer = fs.readFileSync("public/templates/_partials/footer.html", "utf8");
const index = fs.readFileSync("public/templates/index.html", "utf8");

const support = fs.readFileSync("public/templates/support/support.html", "utf8");

router.get("/", (req, res) => {
    return res.send(header + index + support +footer);
 });

 module.exports = router