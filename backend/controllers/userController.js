const User = require("../models/User");
const bcrypt = require("bcrypt");

// USER REGISTRATION
exports.registerUser = async (req, res) => {
  const { email, password, username, fullName } = req.body;

  try {
    // Validate input
    if (!email || !password || !username || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create(email, passwordHash, username, fullName);
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.full_name,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);

    // Handle duplicate email error
    if (error.code === "23505") {
      return res.status(409).json({ message: "Email already in use" });
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
        fullName: user.full_name,
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
        fullName: user.full_name,
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
  const { fullName, profilePhotoUrl } = req.body;

  try {
    const user = await User.update(userId, { fullName, profilePhotoUrl });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.full_name,
        profilePhotoUrl: user.profile_photo_url,
      },
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
