const express = require('express');

const {
    createApplication,
    fetchApplication
} = require('../controllers/projApplicationController');

const router = express.Router();

//Create an application to join a project
router.post('/createApplication', createApplication);

//Retrieve all active applications
router.get('/getApps', fetchApplication);

module.exports = router;