const express = require('express');
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const support = require('./sockets/support.js');
const http = require('http');

const server = http.createServer(app);

app.use(express.static('public'));
app.use(express.json());

app.use(session({
    key: 'user_sid',
    secret: require('./config/mysqlCredentials').sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: 600000
    }
}))

app.use(cookieParser());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

/* Add socket */
let supportSocket = new support(app, server);

/* Add routes */

const defaultRoute = require('./routes/default.js');
const authRoute = require('./routes/auth.js');
const usersRoute = require('./routes/users.js');
const recipesRoute = require('./routes/recipes.js');
const pagesRoute = require('./routes/pages.js');
const challengeRoute = require('./routes/challenge.js');

app.use(authRoute);
app.use(usersRoute);
app.use(defaultRoute);
app.use(recipesRoute);
app.use(pagesRoute);
app.use(challengeRoute);

/* Add database and models */

const { Model } = require('objection');
const Knex = require('knex');
const knexFile = require('./knexfile.js');

const knex = Knex(knexFile.development);

Model.knex(knex);

const PORT = 3000;

server.listen(PORT, (error) => {
    if (error) {
        console.log(error);
    }
    console.log("Server is running on port", PORT);
})