const express = require('express');

const { acceptProject,rejectProject } = require('../controllers/projAllocationController');
const router = express.Router();

router.post('/accept', acceptProject);
router.post('/reject', rejectProject);

module.exports = router;
