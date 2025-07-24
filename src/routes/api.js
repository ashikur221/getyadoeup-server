const express = require('express');
const { hello } = require('../controllers/HelloController.js');
const { signup, login, verifyOtp, getUserProfile, updateUserProfile, changePassword, forgetPassword, resetPassword, deleteAccount, deleteAllAccounts, updateUserRoleByAdmin, deleteUserByAdmin, getUserById } = require('../controllers/AuthController.js');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth.middleware.js');
const { getAllUsers, deleteCourseByAdmin } = require('../controllers/AdminController.js');
const { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog } = require('../controllers/BlogController.js');
const { createTestimonial, getAllTestimonials, updateTestimonial, deleteTestimonial, getTestimonialById } = require('../controllers/TestimonialController.js');
const { updateTrainerProfile, getTrainerInfo, getAllTrainers, setTrainerFeatured, getFeaturedTrainers, deleteTrainer, getCoursesByTrainer, deleteCourseByTrainer, updateCourseByTrainer } = require('../controllers/TrainerController.js');
const { createCourse, getSingleCourse, getAllCourses, contactTrainerInfo, getBookmarkedCourses, toggleBookmark } = require('../controllers/CourseController.js');
const { generateReviewLink, verifyReviewLink, submitReview, getReviewsByStudent, getReviewsByTrainer, getReviewByCourse } = require('../controllers/ReviewController.js');

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
// admin course related api 
router.delete("/admin/delete-course/:courseId", authenticateToken, authorizeRoles("admin"), deleteCourseByAdmin);


// Trainer profile
router.put("/trainer/update-profile", authenticateToken, updateTrainerProfile);
router.get("/trainer/get-profile", authenticateToken, authorizeRoles("trainer"), getTrainerInfo);
router.get('/trainer/get-all-trainer', authenticateToken, authorizeRoles("admin"), getAllTrainers);
router.put('/trainer/set-featured', authenticateToken, authorizeRoles("admin"), setTrainerFeatured);
router.get('/trainer/get-featured-trainer', getFeaturedTrainers);
router.delete('/trainer/delete/:userId', authenticateToken, authorizeRoles("admin"), deleteTrainer);


// course Related API 
router.post('/trainer/create-course', authenticateToken, createCourse);
router.get('/course/:courseId', getSingleCourse);
router.get('/all-courses', getAllCourses);
router.get('/trainer-info/:id', contactTrainerInfo)
router.post('/add-bookmark', authenticateToken, authorizeRoles("student"), toggleBookmark);
router.get('/get-bookmarked-courses', authenticateToken, authorizeRoles("student"), getBookmarkedCourses);


// review related api 
router.post('/trainer/generate-review-link', authenticateToken, authorizeRoles("trainer"), generateReviewLink);
router.get('/verify-review-link/:token', verifyReviewLink);
router.post('/student/submitReview', authenticateToken, authorizeRoles("student"), submitReview);
router.get('/student/get-reviews', authenticateToken, authorizeRoles("student"), getReviewsByStudent);
router.get('/trainer/get-reviews', authenticateToken, authorizeRoles("trainer"), getReviewsByTrainer);
router.get('/course/get-reviews/:id', getReviewByCourse);

// trainer dashboard related API
router.get('/trainer/get-courses', authenticateToken, authorizeRoles("trainer"), getCoursesByTrainer);
router.delete('/trainer/delete-course/:courseId', authenticateToken, authorizeRoles("trainer"), deleteCourseByTrainer);
// trainer update course
router.put('/trainer/update-course/:courseId', authenticateToken, authorizeRoles("trainer"), updateCourseByTrainer);


module.exports = router;


