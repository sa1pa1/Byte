const User = require("../models/User");
const bcrypt = require("bcrypt");

// Helper function to validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function to validate password strength
const isValidPassword = (password) => {
  // Must have at least one number and one special character
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  return password.length >= 6 && hasNumber && hasSpecialChar;
};

// Helper function to validate username
const isValidUsername = (username) => {
  // No spaces allowed
  return !/\s/.test(username);
};

// Helper function to validate name (no numbers)
const isValidName = (name) => {
  return !/\d/.test(name);
};

// USER REGISTRATION
exports.registerUser = async (req, res) => {
  const { email, password, username, firstName, lastName, phoneNumber, city, country } = req.body;

  try {
    // Validate required fields
    if (!email || !password || !username || !firstName || !lastName) {
      return res.status(400).json({ 
        message: "Email, password, username, first name, and last name are required" 
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if email is unique
    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      return res.status(409).json({ message: "Email address is already in use" });
    }

    // Validate password strength (at least one number and one special character)
    if (!isValidPassword(password)) {
      return res.status(400).json({ 
        message: "Password must be at least 6 characters long and contain at least one number and one special character" 
      });
    }

    // Validate username (no spaces)
    if (!isValidUsername(username)) {
      return res.status(400).json({ 
        message: "Username cannot contain spaces" 
      });
    }

    // Check if username is unique
    const existingUsername = await User.findByUsername(username);
    if (existingUsername) {
      return res.status(409).json({ message: "Username is already taken" });
    }

    // Validate first name (no numbers)
    if (!isValidName(firstName)) {
      return res.status(400).json({ 
        message: "First name cannot contain numbers" 
      });
    }

    // Validate last name (no numbers)
    if (!isValidName(lastName)) {
      return res.status(400).json({ 
        message: "Last name cannot contain numbers" 
      });
    }

    // Validate phone number is unique (if provided)
    if (phoneNumber) {
      const existingPhone = await User.findByPhoneNumber(phoneNumber);
      if (existingPhone) {
        return res.status(409).json({ message: "Phone number is already in use" });
      }
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user with all fields
    const user = await User.create(
      email, 
      passwordHash, 
      username, 
      firstName, 
      lastName, 
      phoneNumber || null, 
      city || null, 
      country || null
    );

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        phoneNumber: user.phone_number,
        city: user.city,
        country: user.country,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);

    // Handle database constraint errors
    if (error.code === "23505") {
      if (error.constraint === "users_email_key") {
        return res.status(409).json({ message: "Email already in use" });
      }
      if (error.constraint === "users_username_key") {
        return res.status(409).json({ message: "Username already taken" });
      }
      if (error.constraint === "users_phone_number_key") {
        return res.status(409).json({ message: "Phone number already in use" });
      }
    }

    res.status(500).json({ message: "Internal server error" });
  }
};

// USER LOGIN
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Fetch user by email using the User model
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Successful login
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        phoneNumber: user.phone_number,
        city: user.city,
        country: user.country,
        profilePhotoUrl: user.profile_photo_url,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET USER PROFILE
exports.getUserProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User profile retrieved successfully",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        phoneNumber: user.phone_number,
        city: user.city,
        country: user.country,
        profilePhotoUrl: user.profile_photo_url,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// UPDATE USER PROFILE
exports.updateUserProfile = async (req, res) => {
  const { userId } = req.params;
  const { firstName, lastName, phoneNumber, city, country, profilePhotoUrl } = req.body;

  try {
    // Validate first name (no numbers) if provided
    if (firstName && !isValidName(firstName)) {
      return res.status(400).json({ 
        message: "First name cannot contain numbers" 
      });
    }

    // Validate last name (no numbers) if provided
    if (lastName && !isValidName(lastName)) {
      return res.status(400).json({ 
        message: "Last name cannot contain numbers" 
      });
    }

    // Validate phone number is unique (if provided)
    if (phoneNumber) {
      const existingPhone = await User.findByPhoneNumber(phoneNumber);
      if (existingPhone && existingPhone.id !== parseInt(userId)) {
        return res.status(409).json({ message: "Phone number is already in use by another user" });
      }
    }

    const user = await User.update(userId, { 
      firstName, 
      lastName, 
      phoneNumber, 
      city, 
      country, 
      profilePhotoUrl 
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        phoneNumber: user.phone_number,
        city: user.city,
        country: user.country,
        profilePhotoUrl: user.profile_photo_url,
      },
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};