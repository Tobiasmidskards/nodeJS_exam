const express = require('express');
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const rateLimit = require("express-rate-limit");
const support = require('./sockets/support.js');
const http = require('http');

const server = http.createServer(app);

// Assigning static folder for static files such as templates and assets
app.use(express.static('public'));

// Using middleware to parse json
app.use(express.json());

// Setting up session for authentication
app.use(session({
    key: 'user_sid',
    secret: require('./config/mysqlCredentials').sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: 600000
    }
}))

/* Setup ratelimiter */
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 8 // limit each IP to 100 requests per windowMs
});

app.use('/login', limiter);
app.use('/signup', limiter);
app.use('/recipes/like/:recipeId', limiter);

// Middleware for parsing cookies
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

// start listening on port 3000

const PORT = 3000;

server.listen(PORT, (error) => {
    if (error) {
        console.log(error);
    }
    console.log("Server is running on port", PORT);
})