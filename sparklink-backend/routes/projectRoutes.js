const express = require('express');
const {
  createProject,
  getAllProjects,
  filterProject,
  UpdateProjDetails,
  RemoveProject,
  CompleteProject,
  ResumeProject,
  CancelProject,
  DelayProject,
  getUserRoleAccess,
  applyProject,
  removeStakeholder
} = require('../controllers/projectController');

const {acceptProject, rejectProject}= require('../controllers/projAllocationController');

const router = express.Router();

router.post('/getUserRoleAccess', getUserRoleAccess);

router.post('/applyProject', applyProject);

//Search Filter project with Proj name
router.get('/filter', filterProject);

// POST route to create a new project
router.post('/', createProject);

// GET route to fetch all projects
router.get('/', getAllProjects);

//Update Project Details
router.post('/updateProject', UpdateProjDetails);

//Delete Project
router.post('/deleteProject', RemoveProject);

//Complete Project
router.post('/completeProject', CompleteProject);

//Resume Project
router.post('/resumeProject', ResumeProject);

//Fail Project
router.post('/cancelProject', CancelProject);

//Delay Project
router.post('/delayProject', DelayProject);

//Remove Project
router.post('/removeStakeholder', removeStakeholder);

router.post('/accept', acceptProject);

router.post('/reject', rejectProject);

module.exports = router;
