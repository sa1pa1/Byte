const Recipe = require("../models/Recipe");

// CREATE RECIPE
exports.createRecipe = async (req, res) => {
  const {
    userId,
    title,
    OriginalSourceUrl,
    OriginalRecipeText,
    modifications,
    notes,
    cookedDate,
    occasion,
  } = req.body;

  try {
    // Validate required fields
    if (!userId || !title) {
      return res
        .status(400)
        .json({ message: "User ID and title are required" });
    }

    const recipe = await Recipe.create({
      userId,
      title,
      OriginalSourceUrl,
      OriginalRecipeText,
      modifications,
      notes,
      cookedDate,
      occasion,
    });

    res.status(201).json({
      message: "Recipe created successfully",
      recipe,
    });
  } catch (error) {
    console.error("Error creating recipe:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//GET RECIPES BY USER ID
exports.getRecipesByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const recipe = await Recipe.findByuserID(userId);

    res.status(200).json({
      message: "Recipes retrieved successfully",
      recipes: recipe,
    });
  } catch (error) {
    console.error("Error retrieving recipes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//GET RECIPE BY RECIPE ID
exports.getRecipe = async (req, res) => {
  const { id: recipeId } = req.params;

  try {
    const recipe = await Recipe.findbyID(recipeId);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.status(200).json({
      message: "Recipe retrieved successfully",
      recipe: recipe,
    });
  } catch (error) {
    console.error("Error retrieving recipe:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//DELETE RECIPE
exports.deleteRecipe = async (req, res) => {
  const { id: recipeId } = req.params;
  const { userId } = req.body; //Assuming userId is sent in the request body for authentication

  try {
    // Validate input
    if (!recipeId || !userId) {
      return res
        .status(400)
        .json({ message: "Recipe ID and User ID are required" });
    }

    const deletedRecipe = await Recipe.delete(recipeId, userId);

    if (!deletedRecipe) {
      return res
        .status(404)
        .json({ message: "Recipe not found or unauthorized" });
    }

    res.status(200).json({
      message: "Recipe deleted successfully",
      recipeId: deletedRecipe.id,
    });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
