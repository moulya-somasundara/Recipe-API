var express = require('express');
var router = express.Router();
var data = require("../data");
var recipeData = data.recipes;

router.get("/", (req, res) => {
    recipeData.getAllRecipes().then((recipeList) => {
        res.json(recipeList);
    }).catch((e) => {
        res.status(500).json({ error: e });
    });
});

router.get("/:id", (req, res) => {
    recipeData.getRecipeById(req.params.id).then((recipe) => {
        res.json(recipe);
    }).catch(() => {
        res.status(404).json({ error: "Recipe not found" });
    });
});

router.post("/", (req, res) => {
    var blogPostData = req.body;

    recipeData.addRecipe(blogPostData.title, blogPostData.ingredients, blogPostData.steps)
        .then((newRecipe) => {
            res.json(newRecipe);
        }).catch((e) => {
            res.status(500).json({ error: e });
        });
});

router.put("/:id", (req, res) => {
    var updatedData = req.body;

    var getRecipe = recipeData.getRecipeById(req.params.id);

    getRecipe.then(() => {
        return recipeData.updateRecipe(req.params.id, updatedData)
            .then((updatedRecipe) => {
                res.json(updatedRecipe);
            }).catch((e) => {
                res.status(500).json({ error: e });
            });
    }).catch(() => {
        res.status(404).json({ error: "Recipe not found to update" });
    });

});

router.delete("/:id", (req, res) => {
    var getRecipe = recipeData.getRecipeById(req.params.id);

    getRecipe.then(() => {
        return recipeData.removeRecipe(req.params.id)
            .then(() => {
                res.sendStatus(200);
            }).catch((e) => {
                res.status(500).json({ error: e });
            });
    }).catch(() => {
        res.status(404).json({ error: "Recipe not found to delete" });
    });
});


module.exports = router;