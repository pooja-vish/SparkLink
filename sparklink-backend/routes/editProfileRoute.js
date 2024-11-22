const express = require('express');
const router = express.Router();
const editProfileController = require('../controllers/editProfileController');  // Adjust path as needed

router.get('/', editProfileController.getProfile);
router.post('/', editProfileController.updateProfile);
// router.post('/updateProfile', profileController.updateProfile);

module.exports = router;