const router = require('express').Router();

const User = require('../models/User.js');
const Role = require('../models/Role.js');
const fs = require('fs');

router.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');        
    }
    next();
});

router.get('/user/recipes', async (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        try {
            const user = await User.query().select()
                                .withGraphFetched('role')
                                .withGraphFetched('recipe')
                                .withGraphFetched('recipe.style')
                                .where('id', '=', req.session.user.id).first();

            return res.send({ response: user });
        }
        catch (err) {
            return res.status(500).send({ response: "Something went wrong with the database: " + err });
        }
    } else {
        return res.status(401).send({ response: "Unauthorized" });
    }
});

module.exports = router;