const express = require('express');
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  filterProject,
  UpdateProjDetails,
  RemoveProject,
  CompleteProject,
  ResumeProject,
  FailProject,
  DelayProject,
  getRoles,
  getUserRole
} = require('../controllers/projectController');

const router = express.Router();

router.get('/getRole', getRoles);

router.get('/getUserRole', getUserRole);

//Search Filter project with Proj name
router.get('/filter', filterProject);

// POST route to create a new project
router.post('/', createProject);

// GET route to fetch all projects
router.get('/', getAllProjects);

// GET route to fetch a single project by ID
//router.get('/:id', getProjectById);

// PUT route to update a project by ID
//router.put('/:id', updateProject);

// DELETE route to delete a project by ID
//router.delete('/:id', deleteProject);

//Update Project Details
router.post('/updateProject', UpdateProjDetails);

//Delete Project
router.post('/deleteProject', RemoveProject);

//Complete Project
router.post('/completeProject', CompleteProject);

//Resume Project
router.post('/resumeProject', ResumeProject);

//Fail Project
router.post('/failProject', FailProject);

//Delay Project
router.post('/delayProject', DelayProject);

module.exports = router;