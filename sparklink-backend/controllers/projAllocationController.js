const project_allocation = require("../models/proj_allocation");
const project_application = require("../models/proj_application");

const acceptProject = async (req, res) => {
  try {
    const { proj_id, user_id: student_id, role } = req.body;
    
    // Find an existing project allocation record by proj_id
    const existingRecord = await project_allocation.findOne({
      where: { proj_id },
    });
    if (existingRecord) {
      // If student field is null or empty, set it to student_id
      // Otherwise, append `,student_id` to the existing student field
      const updatedStudent = existingRecord.student
        ? `${existingRecord.student},${student_id}`
        : student_id.toString();

      await existingRecord.update({
        student: updatedStudent,
      });

      await project_application.update(
        {
          is_active: 'N',
          is_approved: 'Y',
        },
        {
          where: {
            proj_id,
            user_id: student_id,
            role,
          },
        }
      );

      res.status(200).json({
        message: "Project application accepted and updated successfully",
      });
    } else {
      // If no existing record, create a new one
      res.status(400).json({
        message: "No existing project",
      });
    }
  } catch (error) {
    console.error("Error accepting project:", error);
    res.status(500).json({ error: "Failed to accept project application" });
  }
};
const rejectProject = async (req, res) => {
  const { proj_id, user_id: student_id, role } = req.body;

  try {
    // Check if the project application exists
    const existingApplication = await project_application.findOne({
      where: {
        proj_id,
        user_id: student_id,
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
          user_id: student_id,
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
