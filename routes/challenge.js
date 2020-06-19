const router = require('express').Router();

const Recipe = require('../models/Recipe.js');

router.get("/challenge/start", (req, res) => {
    return res.send(header + challenge + footer);
 });

// Route to recieve styles for the recipes select input
router.get('/challenge/result/:styleId', async (req, res) => {

    let styleId = req.params.styleId;

    if (styleId) {
        try {
            const recipe = await Recipe.query().select().withGraphFetched('style').where('style_id', '=', styleId).where('approved', '=', true).orderByRaw('RAND()').first();
            return res.send({ recipe });
        }
        catch (err) {
            return res.status(500).send({ response: "Something went wrong with the database: " + err });
        }
    } else {
        return res.status(500).send({ response: "Please provide a style id"});
    }
});

module.exports = router