const ProjApplication = require('../models/proj_application');

exports.createApplication = async (req, res) => {
    try {
        const { projectList } = req.body;

        const projData = await ProjApplication.create(projectList);
        res.status(201).json({ message: "Project Application saved successfully", projData });
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "Error saving project application", error: error.message });
    }
}

exports.fetchApplication = async (req, res) => {
    try {
        const user = req.user;
        const applicationData = await ProjApplication.findAll({
            where: { is_active: 'Y', is_approved: 'N' }
        });

        res.status(201).json({
            message: "Project Application(s) retrieved successfully",
            applicationData,
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                role: user.role,
                isAuthenticated: true
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving Project Application(s)", error: error.message });
    }
}