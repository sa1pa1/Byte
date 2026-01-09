const pool = require("../config/database");

class User {
  // Create a new user
  static async create(email, passwordHash, username, fullName) {
    const query = `
      INSERT INTO users (email, password_hash, username, full_name)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, username, full_name, created_at
    `;
    const values = [email, passwordHash, username, fullName];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    const query = `
    SELECT * 
    FROM users 
    WHERE email = $1`;

    try {
      const result = await pool.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    const query =`
    SELECT id, email, username, full_name, profile_photo_url, created_at 
    FROM users WHERE id = $1`;

    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Update user profile
  static async update(id, updates) {
    const { fullName, profilePhotoUrl } = updates;
    const query = `
      UPDATE users 
      SET full_name = COALESCE($1, full_name),
          profile_photo_url = COALESCE($2, profile_photo_url),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING id, email, username, full_name, profile_photo_url
    `;

    try {
      const result = await pool.query(query, [fullName, profilePhotoUrl, id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
