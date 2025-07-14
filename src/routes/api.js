const express = require('express');
const { hello } = require('../controllers/HelloController.js');
const router = express.Router();

router.get('/', hello);

module.exports = router;