var mongoCollections = require("../config/mongoCollections");
var recipes = mongoCollections.recipes;
var uuid = require('node-uuid');

var exportedMethods = {
    getAllRecipes() {
        return recipes().then((recipeCollection) => {
            return recipeCollection.find({},{"_id":1,"title":1}).toArray();
        });
    },
    getRecipeById(id) {
        return recipes().then((recipeCollection) => {
            return recipeCollection.findOne({ _id: id }).then((recipe) => {
                if (!recipe) throw "Recipe not found";
                return recipe;
            });
        });
    },
    addRecipe(title, ingredients, steps) {
        return recipes().then((recipeCollection) => {
           var newRecipe = {
                _id: uuid.v4(),
                title: title,
                ingredients: ingredients,
                steps: steps,
                comments: []
            };
        return recipeCollection.insertOne(newRecipe).then((newInsertInformation) => {
            return newInsertInformation.insertedId;
                    }).then((newId) => {
                        return this.getRecipeById(newId);
            });
                
        });
    },
    removeRecipe(id) {
        return recipes().then((recipeCollection) => {
            return recipeCollection.removeOne({ _id: id }).then((deletionInfo) => {
                if (deletionInfo.deletedCount === 0) {
                    throw "Could not delete recipe with id of " +id
                }
            });
        });
    },
    updateRecipe(id, updatedRecipe) {
        return recipes().then((recipeCollection) => {
            var updatedRecipeData = {};

            if (updatedRecipe.ingredients) {
                updatedRecipeData.ingredients = updatedRecipe.ingredients;
            }

            if (updatedRecipe.title) {
                updatedRecipeData.title = updatedRecipe.title;
            }

            if (updatedRecipe.steps) {
                updatedRecipeData.steps = updatedRecipe.steps;
            }

            var updateCommand = {
                $set: updatedRecipeData
            };

            return recipeCollection.updateOne({ _id: id }, updateCommand).then((result) => {
                return this.getRecipeById(id);
            });
        });
    },
}
module.exports = exportedMethods;