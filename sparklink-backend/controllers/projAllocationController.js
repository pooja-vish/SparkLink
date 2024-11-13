const project_allocation = require("../models/proj_allocation");

const acceptProject = async (req, res) => {
  try {
    const { proj_id, project_owner, supervisor, student } = req.body;

    const existingRecord = await project_allocation.findOne({
      where: { proj_id },
    });

    if (existingRecord) {
      await existingRecord.update({
        student: student || existingRecord.student,
      });
      res.status(200).json({
        message: "Project application accepted and updated successfully",
      });
    } else {
      await project_allocation.create({
        proj_id,
        project_owner,
        supervisor,
        student,
      });
      res.status(201).json({
        message: "Project application accepted and created successfully",
      });
    }
  } catch (error) {
    console.error("Error accepting project:", error);
    res.status(500).json({ error: "Failed to accept project application" });
  }

  return res.status(200).json({ message: "Supervisor applied for project" });
};

const rejectProject = async (req, res) => {
  const { proj_id, project_owner } = req.body;

  try {
    // Check if a record with the given proj_id and project_owner exists
    const existingRecord = await ProjAllocation.findOne({
      where: { proj_id, project_owner },
    });

    if (existingRecord) {
      // If the record exists, delete it or mark it as rejected
      await existingRecord.destroy();
      res
        .status(200)
        .json({ message: "Project application rejected successfully" });
    } else {
      res.status(404).json({ message: "Project application not found" });
    }
  } catch (error) {
    console.error("Error rejecting project:", error);
    res.status(500).json({ error: "Failed to reject project application" });
  }
};

module.exports = {
  acceptProject,
  rejectProject,
};
