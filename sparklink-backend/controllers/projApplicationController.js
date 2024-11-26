const ProjApplication = require('../models/proj_application');
const ProjAllocation = require('../models/proj_allocation');
const User = require('../models/user');
const Project = require('../models/project');

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

        // Step 1: Retrieve proj_id's for the current user from ProjAllocation
        const allocations = await ProjAllocation.findAll({
            where: { user_id: user.user_id,
                role: '3'
             },
            attributes: ['proj_id']
        });

        const projIds = allocations.map(allocation => allocation.proj_id);

        if (projIds.length === 0) {
            return res.status(404).json({
                message: "No project allocations found for the current user.",
                applicationData: [],
                user: {
                    user_id: user.user_id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    isAuthenticated: true
                }
            });
        }

        // Step 2: Fetch Project Applications based on proj_id and role = 4
        const applicationData = await ProjApplication.findAll({
            where: {
                proj_id: projIds, 
                role: 4, 
                is_active: 'Y', 
                is_approved: 'N'
            },
            include: [
                {
                    model: User,
                    attributes: ['username'],
                    as: 'user'
                },
                {
                    model: Project,
                    attributes: ['project_name'],
                    as: 'project'
                }
            ]
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
        res.status(500).json({
            message: "Error retrieving Project Application(s)",
            error: error.message
        });
    }
};
