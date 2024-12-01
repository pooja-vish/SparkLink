const express = require('express');

const {
    createApplication
} = require('../controllers/projApplicationController');

const router = express.Router();

//Create an application to join a project
router.post('/createApplication', createApplication);

module.exports = router;