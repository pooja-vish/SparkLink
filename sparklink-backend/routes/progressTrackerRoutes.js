const express = require('express');
const {
  createMilestone,
  FetchMilestone,
  UpdateMilestone,
  DeleteMilestone,
  CompleteMilestone,
  ProjMilestones,
  getUserRoleAccess,
  ResumeMilestone,
  filterProjMilestones
} = require('../controllers/progressTrackerController');

const router = express.Router();

//Create New Milestones with { proj_id, milestone_id }
router.post('/createMilestone', createMilestone);

//Fetch Milestones with { proj_id, milestone_id }
router.post('/fetchMilestone', FetchMilestone);

//Update Milestone
router.post('/updateMilestone', UpdateMilestone);

//Delete Milestone
router.post('/deleteMilestone', DeleteMilestone);

//Complete Milestone
router.post('/completeMilestone', CompleteMilestone);

//Fetch Project Milestone(s) by proj_id
router.get('/projMilestones', ProjMilestones);

//Fetch User Role Access
router.post('/getUserRoleAccess', getUserRoleAccess);

//Resume Milestone
router.post('/resumeMilestone', ResumeMilestone);

//Search Filter project with Proj name
router.get('/filterProjMilestones', filterProjMilestones);

module.exports = router;