const express = require('express');
const { hello } = require('../controllers/HelloController.js');
const { signup } = require('../controllers/AuthController.js');
const router = express.Router();

router.get('/', hello);

// authentication related api 
router.post("/signup", signup)


module.exports = router;