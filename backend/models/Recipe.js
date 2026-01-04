const pool = require("../config/database");

class Recipe {
  // Create a new recipe
  static async create(recipeData) {
    const {
      userId,
      title,
      OriginalSourceUrl,
      OriginalRecipeText,
      modifications,
      notes,
      cookedDate,
      occasion,
    } = recipeData;

    const query = `
      INSERT INTO recipes (user_id, title, original_source_url, original_recipe_text, modifications, notes, cooked_date, occasion)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const values = [
      userId,
      title,
      OriginalSourceUrl,
      OriginalRecipeText,
      modifications,
      notes,
      cookedDate,
      occasion,
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  //Get recipes by user ID
  static async findByuserID(userId) {
    const query = `
    SELECT * FROM recipes
    WHERE user_id = $1
    ORDER BY created_at DESC
    `;
    try {
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      {
        throw error;
      }
    }
  }

  //find recipe by id
  static async findbyID(recipeId) {
    const query = `
    SELECT r.*, u.username
    from recipes r
    LEFT JOIN users u ON r.user_id = u.id
    WHERE r.id = $1
    `;

    try {
      const result = await pool.query(query, [recipeId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Delete a recipe
  static async delete(recipeId, userId) {
    const query =
      "DELETE FROM recipes WHERE id = $1 AND user_id = $2 RETURNING id";

    try {
      const result = await pool.query(query, [recipeId, userId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Recipe;
