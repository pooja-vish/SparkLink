const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');  // Adjust path as needed

router.get('/', profileController.getProfile);

module.exports = router;
