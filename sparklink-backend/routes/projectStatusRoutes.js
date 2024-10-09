const express = require('express');
const router = express.Router();
const projectStatusController = require('../controllers/projectStatusController');



router.get('/project-statuses', projectStatusController.getAllProjectStatuses);

// Get a specific project status by ID
router.get('/project-statuses/:statusId', projectStatusController.getProjectStatusById);

// Create a new project status
router.post('/project-statuses', projectStatusController.createProjectStatus);

// Update a project status by ID
router.put('/project-statuses/:statusId', projectStatusController.updateProjectStatus);

// Delete a project status by ID
router.delete('/project-statuses/:statusId', projectStatusController.deleteProjectStatus);

module.exports = router;
