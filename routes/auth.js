const route = require('express').Router();

const User = require('../models/User.js');
const Role = require('../models/Role.js');

const bcrypt = require('bcrypt');
const saltRounds = 12;

route.post("/login", async (req, res) => {
    const {username, password} = req.body;

    // Check if the required fields are present
    if (!username || !password) {
        return res.send({ response: 'Please give username and password' });
    }

    if (username && password) {
        if (password.length < 8) {
            return res.status(400).send({ response: "Password does not fulfill the requirements" });
        } else {
            try {
                // Fetching the user by username
                const user = await User.query().select().where({ username: username }).first();                

                if (user) {

                    // Using bcrypt to compare the password with the database
                    const result = await bcrypt.compare(password, user.password);

                    if (result) {

                        // Assigning the user object to the session
                        req.session.user = user;
                        return res.send({ response: 'OK' });
                    } else {
                        return res.status(401).send({ response: 'Unauthorized' });
                    }
                } else {
                    return res.status(400).send({ response: "User not found" });
                }
                
            } catch (error) {
                return res.status(500).send({ response: "Something went wrong with the database: " + error });
            }
        }
    } else {
        return res.status(404).send({ response: "Error" });
    }
});

route.post("/signup", async (req, res) => {    
    const { username, password, passwordRepeat } = req.body;
    
    // Returns a boolean whether or not the passwords are the same
    const isPasswordTheSame = password === passwordRepeat;
    
    if (username && password && isPasswordTheSame) {
        if (password.length < 8) {
            return res.status(400).send({ response: "Password does not fulfill the requirements" });
        } else {
            try {

                // Fetching the user with the provided username
                const userFound = await User.query().select().where({ 'username': username }).limit(1);
                if (userFound.length > 0) {
                    // the username already exists
                    return res.status(400).send({ response: "User already exists" });
                } else {
                    // Find the userrole for the user               
                    const defaultUserRoles = await Role.query().select().where({ role: 'USER' });

                    // Hash the password using bcrypt
                    const hashedPassword = await bcrypt.hash(password, saltRounds);

                    // Create the user
                    const createdUser = await User.query().insert({
                        username,
                        password: hashedPassword,
                        roleId: defaultUserRoles[0].id
                    });

                    return res.send({ response: `User has been created with the username ${createdUser.username}` });
                }

            } catch (error) {
                return res.status(500).send({ response: "Something went wrong with the database" });
            }
        }
    } else if (password && passwordRepeat && !isPasswordTheSame) {
        return res.status(400).send({ response: "Passwords do not match. Fields: password and passwordRepeat" });
    } else {
        return res.status(404).send({ response: "Missing fields: username, password, passwordRepeat" });
    }
    
});

route.get('/logout', (req, res) => {
    // Logout and clear the session
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});

module.exports = route;