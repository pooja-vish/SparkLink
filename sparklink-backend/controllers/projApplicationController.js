const ProjApplication = require("../models/proj_application");

exports.createApplication = async (req, res) => {
  try {
    const { projectList } = req.body;

    const projData = await ProjApplication.create(projectList);
    res
      .status(201)
      .json({ message: "Project Application saved successfully", projData });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error saving project application",
      error: error.message,
    });
  }
};

