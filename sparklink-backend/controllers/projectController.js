const Project = require("../models/project");

// Create a new project
exports.createProject = async (req, res) => {
  try {
    console.log("Request received");

    // Destructure fields from the request body
    const {
      project_name,
      purpose,
      product,
      project_budget,
      project_audience,
      features,
      project_deadline,
      image_url, // Add image_url field
    } = req.body;

    // Validate required fields
    if (
      !project_name ||
      !purpose ||
      !product ||
      !project_budget ||
      !project_deadline ||
      !image_url
    ) {
      return res
        .status(400)
        .json({
          message:
            "Please provide all required fields: project_name, purpose, product, project_budget, project_deadline, and image_url.",
        });
    }

    // Combine fields to form proj_desc
    const proj_desc = `Purpose: ${purpose}, Product: ${product}, Features: ${features}`;

    // Prepare project data for the database
    const projectData = {
      proj_desc: proj_desc,
      budget: project_budget,
      end_date: project_deadline, // Use the correct end date
      created_by: 2, // Replace with req.user.id if you have authentication in place
      status: 1, // Set the default status
      user_id: 2, // Replace with req.user.id if you have authentication in place
      modified_by: 2,
      project_name: project_name,
      image_url: image_url, // Save image URL
    };

    // Create the project in the database
    const project = await Project.create(projectData);

    // Respond with success message and the created project data
    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    // Log error and respond with error message
    console.error(error);
    res
      .status(500)
      .json({ message: "Error creating project", error: error.message });
  }
};

// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll();
    res.status(200).json(projects);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching projects", error: error.message });
  }
};

// Get a single project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({
      where: { proj_id: req.params.id },
    });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json(project);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching project", error: error.message });
  }
};

// Update a project by ID
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      where: { proj_id: req.params.id },
    });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await project.update(req.body);
    res.status(200).json(project);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating project", error: error.message });
  }
};

// Delete a project by ID
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      where: { proj_id: req.params.id },
    });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await project.destroy();
    res.status(204).json({ message: "Project deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting project", error: error.message });
  }
};
