const Project = require("../models/project");
const { Op } = require("sequelize");

// Create a new project
exports.createProject = async (req, res) => {
  try {
    console.log("Request received");
    const today = new Date().toISOString().split("T")[0];
    // Destructure fields from the request body
    const {
      project_name,
      purpose,
      product,
      project_budget,
      project_description,
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
      !project_description ||
      !project_deadline
      // !image_url
    ) {
      return res.status(400).json({
        message:
          "Please provide all required fields: project name, purpose, product,descriptio, budget and deadline",
      });
    }

    //Validations
    // //if image_url is empty
    // if (image_url === "") {
    //   image_url = "defaultImage";
    // }
    // console.log("image url : " + image_url);
    if (project_name.length > 150) {
      console.log("project_name length : " + project_name.length);
      return res
        .status(500)
        .json({ message: "Project name should be less than 10 characters" });
    }
    if (project_budget < 0) {
      console.log("project_name length : " + project_name.length);
      return res
        .status(500)
        .json({
          message: "The project budget must be greater than or equal to zero.",
        });
    }

    if (project_deadline < today) {
      console.log("project_name length : " + project_deadline);
      return res
        .status(500)
        .json({ message: "The project deadline must be a future date." });
    }

    // Combine fields to form proj_desc
    const proj_desc = `Purpose: ${purpose}; Product: ${product}; Description: ${project_description}; Features: ${features}`;

    // Prepare project data for the database
    const projectData = {
      project_name: project_name,
      proj_desc: proj_desc,
      budget: project_budget,
      end_date: project_deadline, // Use the correct end date
      created_by: 2, // Replace with req.user.id if you have authentication in place
      status: 1, // Set the default status
      user_id: 2, // Replace with req.user.id if you have authentication in place
      modified_by: 2,
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

exports.filterProject = async (req, res) => {
  try {
    const { projName } = req.query;

    if (projName && typeof projName !== "string") {
      return res.status(400).json({ message: "Invalid projName parameter" });
    }

    const filter = projName
      ? {
          project_name: {
            [Op.iLike]: `%${projName}%`, // Use iLike for case-insensitive search
          },
        }
      : {}; // If projName is not provided, no filter is applied

    // Fetch projects using the filter
    const projects = await Project.findAll({
      where: filter,
    });

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error filtering projects:", error);
    res
      .status(500)
      .json({ message: "Error filtering projects", error: error.message });
  }
};
