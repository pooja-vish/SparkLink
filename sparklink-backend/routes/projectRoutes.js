const express = require('express');
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  filterProject,
} = require('../controllers/projectController');

const router = express.Router();

// Search Filter project with Proj name
router.get('/filter', filterProject);

// POST route to create a new project
router.post('/', createProject);

// GET route to fetch all projects
router.get('/', getAllProjects);

// GET route to fetch a single project by ID
router.get('/:id', getProjectById);

// PUT route to update a project by ID
router.put('/:id', updateProject);

// DELETE route to delete a project by ID
router.delete('/:id', deleteProject);

module.exports = router;
