const router = require('express').Router();

const escape = require('escape-html');
const Recipe = require('../models/Recipe.js');
const Style = require('../models/Style.js');
const Role = require('../models/Role.js');

// Check if the request is sent from an admin
let isAdminAPI = async (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        const roleId = req.session.user.roleId;
        try {
            const role = await Role.query().findById(roleId);
            if (role.role === 'ADMIN') {
                next();
            } else {
                return res.status(401).send({ response: "Unauthorized, you are not admin" });
            }
        } catch (error) {
            return res.status(500).send({ response: "Something went wrong with the database: " + err });
        }
        
    } else {
        next();
    }    
};

// Check if the request is sent from a user
let usersOnlyAPI = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        next();
    } else {
        return res.status(401).send({ response: "Unauthorized" });
    }    
};

// Get all recipes with the styles associated attatched
router.get('/recipes', async (req, res) => {
    try {
        const recipes = await Recipe.query().select().withGraphFetched('style');
        return res.send({ response: recipes });
    }
    catch (err) {
        return res.status(500).send({ response: "Something went wrong with the database: " + err });
    }
});

// Get a single recipe by the recipe ID
router.get('/recipes/get/:recipeId', async (req, res) => {
    let recipeId = req.params.recipeId

    if (recipeId) {
        try {
            const recipe = await Recipe.query().select().withGraphFetched('style').findById(recipeId);

            if (recipe.userId == req.session.user.id) {
                return res.send({ recipe });
            } else {
                return res.status(401).send({ response: "Unauthorized, not your recipe" });
            }
        }
        catch (err) {
            return res.status(500).send({ response: "Something went wrong with the database: " + err });
        }
    } else {
        return res.status(500).send({ response: "Please provide a recipe id"});
    }

});

// Create a recipe
router.post('/recipes/create', usersOnlyAPI, async (req, res) => {
    const { name, prepTime, styleId, description, link} = req.body;

    const style = await Style.query().select().where({ id: styleId }).first();

    if (style === undefined) {
        return res.send({ response: "No style mathing with the id of: " + styleId})
    }

    try {
        const createdRecipe = await Recipe.query().insert({
            name: escape(name),
            description: escape(description),
            link: escape(link),
            prepTime: prepTime,
            styleId,
            userId : req.session.user.id
        });

        return res.send({ response: "OK" });
    }
    catch (err) {
        return res.status(500).send({ response: "Something went wrong with the database: " + err });
    }
    
})

// Update a recipe
router.post('/recipes/update', usersOnlyAPI, async (req, res) => {
    const { recipeId, name, prepTime, styleId, description, link} = req.body;

    const style = await Style.query().select().where({ id: styleId }).first();

    if (style === undefined) {
        return res.send({ response: "No style mathing with the id of: " + styleId})
    }

    if(!recipeId) {
        return res.send({ response: "Please provide a recipe ID"})
    }

    try {
        const recipe = await Recipe.query().select().findById(recipeId);

        if (recipe.userId == req.session.user.id) {
            await Recipe.query().patch({
                name: escape(name),
                description: escape(description),
                link: escape(link),
                prepTime: prepTime,
                styleId,
                userId : req.session.user.id,
                approved : false
            })
            .findById(recipeId);
            return res.send({ response : "OK" });
        } else {
            return res.status(401).send({ response: "Unauthorized, not your recipe" });
        }
    }
    catch (err) {
        return res.status(500).send({ response: "Something went wrong with the database: " + err });
    }
    
})

// Delete a recipe
router.get('/recipes/delete/:recipeId', usersOnlyAPI, async (req, res) => {

    let recipeId = req.params.recipeId;

    if (recipeId) {
        try {
            const recipe = await Recipe.query().select().findById(recipeId);

            if (recipe.userId == req.session.user.id) {
                await Recipe.query().deleteById(recipeId);
                return res.send({ response : "OK" });
            } else {
                return res.status(401).send({ response: "Unauthorized, not your recipe" });
            }
        }
        catch (err) {
            return res.status(500).send({ response: "Something went wrong with the database: " + err });
        }
    } else {
        return res.status(500).send({ response: "Please provide a recipe id"});
    } 
});

// Like a recipe
router.get('/recipes/like/:recipeId', async (req, res) => {

    let recipeId = req.params.recipeId;

    if (recipeId) {
        try {
            const recipe = await Recipe.query().select().findById(recipeId);
            await Recipe.query().findById(recipeId)
            .patch({
                likes: recipe.likes + 1
            })

            return res.send({ response : "OK" });
        }
        catch (err) {
            return res.status(500).send({ response: "Something went wrong with the database: " + err });
        }
    } else {
        return res.status(500).send({ response: "Please provide a style id"});
    }

});

// Get all unapproved reciped
router.get('/recipes/unapproved', async (req, res) => {
    try {
        const recipes = await Recipe.query().select().withGraphFetched('style').where('approved', '=', false);
        return res.send({ recipes });
    }
    catch (err) {
        return res.status(500).send({ response: "Something went wrong with the database: " + err });
    }
});

// Approve a recipe, but only if its from an admin
router.post('/recipes/approve', isAdminAPI, async (req, res) => {
    let id = req.body.id;

    if (id) {
        try {
            const recipe = await Recipe.query().findById(id)
                                               .patch({
                                                   approved: true
                                               })
            return res.send({ response: "OK" });
        }
        catch (err) {
            return res.status(500).send({ response: "Something went wrong with the database: " + err });
        }
    }
});

// Get styles
router.get('/styles', async (req, res) => {
    try {
        const styles = await Style.query().select();
        return res.send({ styles: styles });
    }
    catch (err) {
        return res.status(500).send({ response: "Something went wrong with the database: " + err });
    }
});

module.exports = router