const router = require('express').Router();
const fs = require('fs');

const header = fs.readFileSync("public/templates/_partials/header.html", "utf8");
const footer = fs.readFileSync("public/templates/_partials/footer.html", "utf8");
const index = fs.readFileSync("public/templates/index.html", "utf8");
const challenge = fs.readFileSync("public/templates/challenge.html", "utf8");

const support = fs.readFileSync("public/templates/support.html", "utf8");

router.get("/", (req, res) => {
    return res.send(header + index + support +footer);
 });

 router.get("/challenge/start", (req, res) => {
    return res.send(header + challenge + footer);
 });

 module.exports = router