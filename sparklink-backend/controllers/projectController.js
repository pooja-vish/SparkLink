const Project = require("../models/project");
const ProjAllocation = require("../models/proj_allocation");
const ProjApplication = require("../models/proj_application");
const Milestone = require("../models/proj_milestone");
const ProjectStatus = require("../models/proj_status");
const Role = require("../models/role");
const User = require("../models/user");
const Image = require("../models/image");
const { Op } = require("sequelize");
const sequelize = require('../config/db');

// Create a new project
exports.createProject = async (req, res) => {
  const t = await sequelize.transaction(); // Start a transaction
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
      image_url,
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
          "Please provide all required fields: project name, purpose, product, description, budget, and deadline",
      });
    }

    // Validations
    if (project_name.length > 150) {
      console.log("project_name length : " + project_name.length);
      return res
        .status(500)
        .json({ message: "Project name should be less than 150 characters" });
    }
    if (project_budget < 0) {
      return res
        .status(500)
        .json({
          message: "The project budget must be greater than or equal to zero.",
        });
    }

    if (project_deadline < today) {
      return res
        .status(500)
        .json({ message: "The project deadline must be a future date." });
    }

    // Combine fields to form proj_desc
    const proj_desc = `Purpose: ${purpose}; Product: ${product}; Description: ${project_description}; Features: ${features}`;

    const user = req.user;


    const projectData = {
      project_name: project_name,
      proj_desc: proj_desc,
      budget: project_budget,
      end_date: project_deadline,
      created_by: user.user_id,
      status: 1,
      user_id: user.user_id,
      modified_by: user.user_id,
      image_url: image_url,
    };

    // Create the project in the database
    const project = await Project.create(projectData, { transaction: t });

    const projAllocationData = {
      proj_id: project.proj_id, 
      user_id: user.user_id,
      role: 2,
      created_by: user.user_id,
      modified_by: user.user_id,
    };

    // Create the project allocation record in the database
    const allocation = await ProjAllocation.create(projAllocationData, { transaction: t });

    // Commit the transaction
    await t.commit();

    // Respond with success message and the created project data
    res.status(201).json({ message: "Project created successfully", project, allocation });
  } catch (error) {
    // If any error occurs, roll back the transaction
    await t.rollback();

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
    const user = req.user;
    const projects = await Project.findAll({
      where: { is_active: 'Y' }
    });

    if (projects && projects.length > 0) {
      for (let i = 0; i < projects.length; i++) {
        let proj_id = projects[i].proj_id;

        const status_query = `select ps.status_desc
          from t_project pr, t_proj_status ps
          where pr.status = ps.status_id
          and pr.proj_id = :proj_id;`;

        const [statusResult] = await sequelize.query(status_query, {
          replacements: { proj_id }, // Replaces :projId with the actual value
          type: sequelize.QueryTypes.SELECT, // Specifies the query type
        });

        const status_desc = statusResult ? statusResult.status_desc : null;

        projects[i].setDataValue('status_desc', status_desc || '');

        const stakeholder_query = `
        select u.name, 'business_owner' AS role
          from t_usermst u, t_proj_allocation pa
          where u.user_id = pa.user_id
          and pa.role = 2
          and pa.proj_id = :proj_id
        UNION 
        select u.name, 'supervisor' AS role
          from t_usermst u, t_proj_allocation pa
          where u.user_id = pa.user_id
          and pa.role = 3
          and pa.proj_id = :proj_id
        UNION
        select u.name, 'student' AS role
          from t_usermst u, t_proj_allocation pa
          where u.user_id = pa.user_id
          and pa.role = 4
          and pa.proj_id = :proj_id;`;

        const stakeholder = await sequelize.query(stakeholder_query, {
          replacements: { proj_id },
          type: sequelize.QueryTypes.SELECT,
        });

        projects[i].setDataValue('stakeholder', stakeholder || '');

        const activeMilestoneCount = await Milestone.count({
          where: {
            proj_id: proj_id,
            is_active: 'Y'
          }
        });

        const completedMilestoneCount = await Milestone.count({
          where: {
            proj_id: proj_id,
            is_active: 'Y',
            is_completed: 'Y'
          }
        });

        const progress = activeMilestoneCount > 0
          ? Math.round(((completedMilestoneCount / activeMilestoneCount) * 100)) : 0;

        if (isNaN(progress)) {
          progress = 0;
        }


        projects[i].setDataValue('progress', progress);
      }
    }
    res.status(200).json({
      projects,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
        isAuthenticated: true
      }
    }
    );
  } catch (error) {
    console.log(error);
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

exports.UpdateProjDetails = async (req, res) => {
  try {
    const { projDetailsList } = req.body;

    const updatedData = await Project.update({
      proj_desc: projDetailsList.proj_desc,
      skills_req: projDetailsList.skills_req,
      budget: projDetailsList.budget,
      status: projDetailsList.status,
      end_date: projDetailsList.end_date
    }, {
      where: { proj_id: projDetailsList.proj_id }
    });

    res.status(200).json({ message: "Project Details updated successfully", updatedData });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error updating Project Details", error: error.message });
  }
}

exports.RemoveProject = async (req, res) => {
  try {
    const { projData } = req.body;

    const deletedData = await Project.update({
      is_active: 'N'
    }, {
      where: { proj_id: projData.proj_id }
    });

    res.status(200).json({ message: "Project Deleted successfully", deletedData });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error deleting Project", error: error.message });
  }
}

exports.CompleteProject = async (req, res) => {
  try {
    const { projData } = req.body;

    const updatedData = await Project.update({
      status: 5
    }, {
      where: { proj_id: projData.proj_id }
    });

    res.status(200).json(({ message: "Project Marked as Complete successfully", updatedData }))
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error Completing Project", error: error.message });
  }
}

exports.ResumeProject = async (req, res) => {
  try {
    const { projData } = req.body;

    const updatedData = await Project.update({
      status: 4
    }, {
      where: { proj_id: projData.proj_id }
    });

    res.status(200).json({ message: "Project Resumed successfully", updatedData })
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error Resuming Project", error: error.message });
  }
}

exports.CancelProject = async (req, res) => {
  try {
    const { projData } = req.body;

    const updatedData = await Project.update({
      status: 7
    }, {
      where: { proj_id: projData.proj_id }
    });

    res.status(200).json({ message: "Project Resumed successfully", updatedData })
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error Resuming Project", error: error.message });
  }
}

exports.DelayProject = async (req, res) => {
  try {
    const { projData } = req.body;

    const updatedData = await Project.update({
      status: 6
    }, {
      where: { proj_id: projData.proj_id }
    });

    res.status(200).json({ message: "Project Resumed successfully", updatedData })
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error Resuming Project", error: error.message });
  }
}

exports.applyProject = async (req, res) => {
  try {
    const { proj_id } = req.body;
    const user = req.user;
    const user_id = user.user_id;
    const role = Number(user.role);
    let supervisor_count = 0;

    const allocationList = {
      proj_id: proj_id,
      user_id: user_id,
      role: role,
      created_by: user_id,
      modified_by: user_id
    }

    if (role === 3) {
      supervisor_count = await ProjAllocation.count({
        where: {
          proj_id: proj_id,
          role: role
        }
      });

      if (supervisor_count < 2) {
        const supervisor_exists = await ProjAllocation.count({
          where: {
            proj_id: proj_id,
            user_id: user_id,
            role: role
          }
        });

        if (supervisor_exists === 0) {
          const supervisor = await ProjAllocation.create(allocationList, {
            returning: ['proj_id', 'user_id', 'role', 'created_by', 'created_on', 'modified_by', 'modified_on']
          });
          const statusUpdate = await Project.update({
            status: 2,
            modified_by: user_id
          }, {
            where: {
              proj_id: proj_id
            }
          });

          return res.status(200).json({ success: true, message: "Project application successful", supervisor });
        } else {
          return res.status(200).json({ success: false, message: "You are already supervising this project" });
        }
      } else {
        return res.status(200).json({ success: false, message: "This project already has the maximum number of supervisors." });
      }
    } else if (role === 4) {
      const studentApplList = {
        proj_id: proj_id,
        user_id: user_id,
        role: role,
        created_by: user_id,
        modified_by: user_id
      }
      const student = await ProjApplication.create(studentApplList);
      //  student = await ProjAllocation.create(allocationList, {
      //   returning: ['proj_id', 'user_id', 'role', 'created_by', 'created_on', 'modified_by', 'modified_on']
      // });

      // const statusUpdate = await Project.update({
      //   status: 3,
      //   modified_by: user_id
      // }, {
      //   where: {
      //     proj_id: proj_id
      //   }
      // });

      return res.status(200).json({ success: true, message: "Project application successful", student });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error creating a project application", error: error.message });
  }
}

/**
 * access_val === 'S' -> User has admin access can take every action on the Project
 * access_val === 'E' -> User has supervisor role and edit access on the Project
 * access_val === 'A' -> User has access to Apply to the Project
 * access_val === 'B' -> User has access to Edit and Delete access to the Project
 * access_val === 'M' -> User has access to View the Milestones of the Project
 * access_val === 'I' -> User has no access to any action on the Project
 */

exports.getUserRoleAccess = async (req, res) => {
  try {
    const { proj_id } = req.body;

    const user = req.user;
    const user_id = user.user_id;
    const role = Number(user.role);

    let supervisor_count = 0;

    const projStatus = await Project.findOne({
      where: {
        proj_id: proj_id
      },
      attributes: ['proj_id', 'status']
    });

    if (role === 3) { //Managing Supervisor Access
      supervisor_count = await ProjAllocation.count({
        where: {
          proj_id: proj_id,
          role: role
        }
      });

      const supervisor_exists = await ProjAllocation.count({
        where: {
          proj_id: proj_id,
          user_id: user_id,
          role: role
        }
      });

      //Supervisor Edit
      if (supervisor_exists === 1) {
        return res.status(200).json({ success: true, message: "Valid User", access_val: 'E' });
      } else {
        //Supervisor Apply
        if (supervisor_count < 2) {
          if (projStatus.status !== 5 || projStatus.status !== 7) {
            return res.status(200).json({ success: true, message: "Valid User", access_val: 'A' });
          } else {
            return res.status(200).json({ success: true, message: "Valid User", access_val: 'I' });
          }
        } else {
          return res.status(200).json({ succes: false, message: "Invalid User", access_val: 'I' });
        }
      }
    } else if (role === 2) { //Managing Business Owner Access
      const business_owner = await ProjAllocation.count({
        where: {
          proj_id: proj_id,
          user_id: user_id,
          role: role
        }
      });

      if (business_owner === 1) {
        return res.status(200).json({ success: true, message: "Valid User", access_val: 'B' });
      } else {
        return res.status(200).json({ success: false, message: "Invalid User", access_val: 'I' });
      }
    } else if (role === 4) { //Managing Student Access
      const student = await ProjAllocation.count({
        where: {
          proj_id: proj_id,
          user_id: user_id,
          role: role
        }
      });

      const student_appl = await ProjApplication.count({
        where: {
          proj_id: proj_id,
          user_id: user_id,
          role: role,
          is_active: 'Y',
          is_approved: 'N'
        }
      });
      
      if(student_appl === 1) {
        return res.status(200).json({ success: false, message: "Invalid User", access_val: 'I' });
      }

      if (student === 0) {
        if (projStatus.status === 1 || projStatus.status === 2 || projStatus.status === 3 || projStatus.status === 4) {
          return res.status(200).json({ success: true, message: "Valid User", access_val: 'A' });
        } else {
          return res.status(200).json({ success: false, message: "Invalid User", access_val: 'I' });
        }
      } else if (student === 1) {
        if (projStatus.status === 4 || projStatus.status === 5 || projStatus.status === 6 || projStatus.status === 7) {
          return res.status(200).json({ success: true, message: "Valid User", access_val: 'M' });
        } else {
          return res.status(200).json({ success: false, message: "Invalid User", access_val: 'I' });
        }
      }
    } else if (role === 1) { //Managing Admin Access
      return res.status(200).json({ success: true, message: "Valid User", access_val: 'S' });
    } else {
      return res.status(200).json({ success: true, message: "Invalid User", access_val: 'I' });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error verifying User Access", error: error.message });
  }
}

