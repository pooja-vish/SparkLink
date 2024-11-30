const express = require('express');

const {
    createApplication,
    fetchApplication,
    fetchNotificationCount
} = require('../controllers/projApplicationController');

const router = express.Router();

//Create an application to join a project
router.post('/createApplication', createApplication);

//Retrieve all active applications
router.get('/getApps', fetchApplication);

//Fetch Notification Count
router.get('/notifCount', fetchNotificationCount);

module.exports = router;