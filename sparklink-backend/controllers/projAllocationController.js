const project_allocation = require("../models/proj_allocation");
const project_application = require("../models/proj_application");

const acceptProject = async (req, res) => {
  try {
    const { proj_id, user_id, role } = req.body;

    // Define the new allocation object
    const allocationList = {
      proj_id: proj_id,
      user_id: user_id,
      role: role,
      created_by: user_id,
      modified_by: user_id,
    };

    // Insert a new record into the project_allocation table
    await project_allocation.create(allocationList);

    // Update the application status in the project_application table
    await project_application.update(
      {
        is_active: 'N', // Change the status to inactive
        is_approved: 'Y', // Mark as approved
      },
      {
        where: {
          proj_id: proj_id,
          user_id: user_id,
          role: role,
        },
      }
    );

    // Respond with success
    res.status(200).json({
      message: "Project application accepted.",
    });
  } catch (error) {
    console.error("Error accepting project:", error);
    res.status(500).json({ error: "Failed to accept project application." });
  }
};

const rejectProject = async (req, res) => {
  const { proj_id, user_id, role } = req.body;

  try {
    // Check if the project application exists
    const existingApplication = await project_application.findOne({
      where: {
        proj_id,
        user_id,
        role,
      },
    });

    if (!existingApplication) {
      return res.status(404).json({
        message: "No matching project application found",
      });
    }

    // Update the record to mark it as inactive and rejected
    await project_application.update(
      {
        is_active: 'N',
        is_approved: 'N', // Assuming you want to mark the application as rejected
      },
      {
        where: {
          proj_id,
          user_id,
          role,
        },
      }
    );

    res.status(200).json({
      message: "Project application rejected successfully",
    });
  } catch (error) {
    console.error("Error rejecting project:", error);
    res.status(500).json({ error: "Failed to reject project application" });
  }
};

module.exports = {
  acceptProject,
  rejectProject,
};
