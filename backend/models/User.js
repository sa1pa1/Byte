const pool = require("../config/database");

class User {
  // Create a new user
  static async create(email, passwordHash, username, firstName, lastName, phoneNumber, city, country) {
    const query = `
      INSERT INTO users (email, password_hash, username, first_name, last_name, phone_number, city, country)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, email, username, first_name, last_name, phone_number, city, country, created_at
    `;
    
    const values = [email, passwordHash, username, firstName, lastName, phoneNumber, city, country];

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

  // Find user by username
  static async findByUsername(username) {
    const query = `
    SELECT * 
    FROM users 
    WHERE username = $1`;

    try {
      const result = await pool.query(query, [username]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Find user by phone number
  static async findByPhoneNumber(phoneNumber) {
    const query = `
    SELECT * 
    FROM users 
    WHERE phone_number = $1`;

    try {
      const result = await pool.query(query, [phoneNumber]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    const query = `
    SELECT id, email, username, first_name, last_name, phone_number, city, country, profile_photo_url, created_at 
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
    const { firstName, lastName, phoneNumber, city, country, profilePhotoUrl } = updates;
    
    const query = `
      UPDATE users 
      SET first_name = COALESCE($1, first_name),
          last_name = COALESCE($2, last_name),
          phone_number = COALESCE($3, phone_number),
          city = COALESCE($4, city),
          country = COALESCE($5, country),
          profile_photo_url = COALESCE($6, profile_photo_url),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING id, email, username, first_name, last_name, phone_number, city, country, profile_photo_url
    `;

    try {
      const result = await pool.query(query, [
        firstName, 
        lastName, 
        phoneNumber, 
        city, 
        country, 
        profilePhotoUrl, 
        id
      ]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;