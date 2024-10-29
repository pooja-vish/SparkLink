const express = require('express');
const {
  createMilestone,
  FetchMilestone
} = require('../controllers/progressTrackerController');

const router = express.Router();

// Create New Milestones with { proj_id, milestone_id }
router.post('/createMilestone', createMilestone);

// Fetch Milestones with { proj_id, milestone_id }
router.post('/fetchMilestone', FetchMilestone);

module.exports = router;