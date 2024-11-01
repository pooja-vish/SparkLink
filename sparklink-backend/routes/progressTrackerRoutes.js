const express = require('express');
const {
  createMilestone,
  FetchMilestone,
  UpdateMilestone,
  DeleteMilestone,
  CompleteMilestone
} = require('../controllers/progressTrackerController');

const router = express.Router();

// Create New Milestones with { proj_id, milestone_id }
router.post('/createMilestone', createMilestone);

// Fetch Milestones with { proj_id, milestone_id }
router.post('/fetchMilestone', FetchMilestone);

// Update Milestone
router.post('/updateMilestone', UpdateMilestone);

// Delete Milestone
router.post('/deleteMilestone', DeleteMilestone);

// Complete Milestone
router.post('/completeMilestone', CompleteMilestone);

module.exports = router;