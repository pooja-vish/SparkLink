// routes/roleRoutes.js
const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

// Route to add a new role
router.post('/add-role', roleController.addRole);

// Route to fetch all roles
router.get('/roles', roleController.getRoles);

module.exports = router;
