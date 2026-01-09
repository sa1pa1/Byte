cat > (routes / userRoutes.js) << "EOF";
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// User registration route
router.post("/register", userController.registerUser);

// User login route
router.post("/login", userController.loginUser);

// Get user profile
router.get("/:userId", userController.getUserProfile);

// Update user profile
router.put("/:userId", userController.updateUserProfile);

module.exports = router;
EOF;
