const express = require('express');
const { hello } = require('../controllers/HelloController.js');
const { signup, login, verifyOtp, getUserProfile } = require('../controllers/AuthController.js');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth.middleware.js');
const { getAllUsers } = require('../controllers/AdminController.js');
const router = express.Router();

router.get('/', hello);

// authentication related api 
router.post("/signup", signup)
router.post("/login", login)
router.post("/verify-otp", verifyOtp)
router.get("/profile", authenticateToken, getUserProfile)

// admin related api
router.get("/admin/users", authenticateToken, authorizeRoles("admin"), getAllUsers)


module.exports = router;