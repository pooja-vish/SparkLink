const express = require('express');

const { notifications } = require('../controllers/projAllocationController');
const router = express.Router();

router.post('/notifications',notifications);


module.exports = router;
