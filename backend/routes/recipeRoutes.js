const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");
// Create a new recipe
router.post("/", recipeController.createRecipe);

//get recipes by user id
router.get("/user/:userId", recipeController.getRecipesByUserId);

//delete a recipe
router.delete("/:id", recipeController.deleteRecipe);

module.exports = router;
