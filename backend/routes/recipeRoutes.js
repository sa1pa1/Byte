const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
// Create a new recipe
router.post('/', recipeController.createRecipe);

//delete a recipe
router.delete('/:id', recipeController.deleteRecipe);

module.exports = router;
