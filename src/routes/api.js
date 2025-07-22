const express = require('express');
const { hello } = require('../controllers/HelloController.js');
const { signup, login, verifyOtp, getUserProfile, updateUserProfile, changePassword, forgetPassword, resetPassword, deleteAccount, deleteAllAccounts, updateUserRoleByAdmin, deleteUserByAdmin, getUserById } = require('../controllers/AuthController.js');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth.middleware.js');
const { getAllUsers } = require('../controllers/AdminController.js');
const { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog } = require('../controllers/BlogController.js');
const { createTestimonial, getAllTestimonials, updateTestimonial, deleteTestimonial, getTestimonialById } = require('../controllers/TestimonialController.js');
const { updateTrainerProfile, getTrainerInfo, getAllTrainers, setTrainerFeatured, getFeaturedTrainers, deleteTrainer } = require('../controllers/TrainerController.js');
const { createCourse } = require('../controllers/CourseController.js');

const router = express.Router();

router.get('/', hello);

// blog related api
router.post("/create-blog", authenticateToken, authorizeRoles("admin"), createBlog);
router.get("/get-all-blogs", getAllBlogs);
router.get("/get-blog/:id", getBlogById);
router.put("/update-blog/:id", authenticateToken, authorizeRoles("admin"), updateBlog);
router.delete("/delete-blog/:id", authenticateToken, authorizeRoles("admin"), deleteBlog);

// testimonial related api
router.post("/create-testimonial", authenticateToken, authorizeRoles("admin"), createTestimonial);
router.get("/get-all-testimonials", getAllTestimonials);
router.get("/get-testimonial/:id", getTestimonialById);

router.put("/update-testimonial/:id", authenticateToken, authorizeRoles("admin"), updateTestimonial);
router.delete("/delete-testimonial/:id", authenticateToken, authorizeRoles("admin"), deleteTestimonial);



// authentication related api
router.post("/signup", signup)
router.post("/login", login)
router.post("/verify-otp", verifyOtp)
router.get("/profile", authenticateToken, getUserProfile)
router.put("/update-profile", authenticateToken, updateUserProfile);
router.put("/change-password", authenticateToken, changePassword);
router.post("/forget-password", forgetPassword);
router.post("/reset-password", resetPassword);
router.delete("/delete-account", authenticateToken, deleteAccount);


// admin related api
router.get("/admin/users", authenticateToken, authorizeRoles("admin"), getAllUsers);
router.get("/admin/user/:id", authenticateToken, authorizeRoles("admin"), getUserById);
router.put("/admin/update-user-role", authenticateToken, authorizeRoles("admin"), updateUserRoleByAdmin);
router.delete("/admin/delete-user/:id", authenticateToken, authorizeRoles("admin"), deleteUserByAdmin);

// Trainer profile
router.put("/trainer/update-profile", authenticateToken, updateTrainerProfile);
router.get("/trainer/get-profile", authenticateToken, authorizeRoles("trainer"), getTrainerInfo);
router.get('/trainer/get-all-trainer', authenticateToken, authorizeRoles("admin"), getAllTrainers);
router.put('/trainer/set-featured', authenticateToken, authorizeRoles("admin"), setTrainerFeatured);
router.get('/trainer/get-featured-trainer', getFeaturedTrainers);
router.delete('/trainer/delete/:userId', authenticateToken, authorizeRoles("admin"), deleteTrainer);


// course Related API 
router.post('/trainer/create-course', authenticateToken, createCourse)


module.exports = router;


