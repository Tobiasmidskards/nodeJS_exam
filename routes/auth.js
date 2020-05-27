const route = require('express').Router();

const User = require('../models/User.js');
const Role = require('../models/Role.js');

const bcrypt = require('bcrypt');
const saltRounds = 12;

route.post("/login", async (req, res) => {
    const {username, password} = req.body;

    if (!username || !password) {
        return res.send({ response: 'Please give username and password' });
    }

    if (username && password) {
        if (password.length < 8) {
            return res.status(400).send({ response: "Password does not fulfill the requirements" });
        } else {
            try {
                const user = await User.query().select().where({ username: username }).first();                

                if (user) {
                    const result = await bcrypt.compare(password, user.password);

                    if (result) {
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
    // what fields do we need to sign up?
    // username, password, repeat password
    const { username, password, passwordRepeat } = req.body;
    
    const isPasswordTheSame = password === passwordRepeat;
    
    if (username && password && isPasswordTheSame) {
        // password requirements
        if (password.length < 8) {
            return res.status(400).send({ response: "Password does not fulfill the requirements" });
        } else {
            try {
                
            const userFound = await User.query().select().where({ 'username': username }).limit(1);
            if (userFound.length > 0) {
                return res.status(400).send({ response: "User already exists" });
            } else {
               
                const defaultUserRoles = await Role.query().select().where({ role: 'USER' });

                const hashedPassword = await bcrypt.hash(password, saltRounds);
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
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});

module.exports = route;