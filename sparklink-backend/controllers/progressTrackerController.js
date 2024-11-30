const Milestone = require('../models/proj_milestone');
const MilestoneCounter = require('../models/milestone_counter');
const ProjectAllocation = require('../models/proj_allocation');
const Project = require('../models/project');
const ValidationUtil = require('../common/validationUtil');
const sequelize = require('../config/db');

exports.createMilestone = async (req, res) => {
    try {
        const { milestoneList } = req.body;

        if (!milestoneList || !Array.isArray(milestoneList) || milestoneList.length === 0) {
            return res.status(400).json({ message: "Milestone(s) required and cannot be empty" });
        }

        const milestoneData = [];

        for (const milestone of milestoneList) {
            const {
                proj_id,
                milestone_desc,
                milestone_title,
                end_date
            } = milestone;

            const isValidMilestoneTitle = !ValidationUtil.isEmptyString(milestone_title) &&
                !ValidationUtil.isConsecSplChar(milestone_title) &&
                ValidationUtil.isValidString(milestone_title, 5, 250);

            const isValidMilestoneDesc = !ValidationUtil.isEmptyString(milestone_desc) &&
                !ValidationUtil.isConsecSplChar(milestone_desc) &&
                ValidationUtil.isValidString(milestone_desc, 5, 250);

            const isValidDate = ValidationUtil.isValidDate(end_date);

            if (!isValidDate) {
                return res.status(400).json({ message: "Please select a valid date" });
            } else if (!isValidMilestoneTitle) {
                return res.status(400).json({ message: "Please enter a valid Milestone Title - You may not enter consecutive special characters" });
            } else if (!isValidMilestoneDesc) {
                return res.status(400).json({ message: "Please enter valid Milestone Description - You may not enter consecutive special characters" });
            }

            const projMilestoneCount = await MilestoneCounter.findOne({
                where: { proj_id: proj_id }
            });

            if (!projMilestoneCount) {
                const counterList = {
                    proj_id: proj_id,
                    milestone_id: 1
                };
                const milestoneCount = await MilestoneCounter.create(counterList);
            } else {
                m_id = projMilestoneCount.milestone_id + 1;
                await projMilestoneCount.update({ milestone_id: m_id });
            }

            const updatedProjMilestoneCount = await MilestoneCounter.findOne({
                where: { proj_id: proj_id }
            });

            if (updatedProjMilestoneCount) {
                const milestoneList = {
                    proj_id: proj_id,
                    milestone_id: updatedProjMilestoneCount.milestone_id,
                    milestone_desc: milestone_desc.trim(),
                    milestone_title: milestone_title.trim(),
                    end_date: end_date
                }
                const newMilestone = await Milestone.create(milestoneList);

                milestoneData.push(newMilestone);
            }
        }
        res.status(201).json({ message: "Project Milestone(s) created successfully", milestoneData });
    } catch (error) {
        // Log error and respond with error message
        console.error(error);
        res
            .status(500)
            .json({ message: "Error creating project milestone", error: error.message });
    }
};

exports.FetchMilestone = async (req, res) => {
    try {
        const { proj_id } = req.body;

        const milestoneData = await Milestone.findAll({
            where: { proj_id: proj_id, is_active: 'Y' },
            order: [['end_date', 'ASC']]
        });
        res.status(200).json({ message: "Milestone(s) fetched successfully", milestoneData });
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "Error fetching project milestone(s)", error: error.message });
    }
}

exports.UpdateMilestone = async (req, res) => {
    try {
        const { milestoneList } = req.body;

        const isValidMilestoneTitle = !ValidationUtil.isEmptyString(milestoneList.milestone_title) &&
            !ValidationUtil.isConsecSplChar(milestoneList.milestone_title) &&
            ValidationUtil.isValidString(milestoneList.milestone_title, 5, 250);

        const isValidMilestoneDesc = !ValidationUtil.isEmptyString(milestoneList.milestone_desc) &&
            !ValidationUtil.isConsecSplChar(milestoneList.milestone_desc) &&
            ValidationUtil.isValidString(milestoneList.milestone_desc, 5, 250);

        const isValidDate = ValidationUtil.isValidDate(milestoneList.end_date);

        if (!isValidDate) {
            return res.status(400).json({ message: "Please select a valid date" });
        } else if (!isValidMilestoneTitle) {
            return res.status(400).json({ message: "Please enter a valid Milestone Title - You may not enter consecutive special characters" });
        } else if (!isValidMilestoneDesc) {
            return res.status(400).json({ message: "Please enter valid Milestone Description - You may not enter consecutive special characters" });
        }

        const updatedData = await Milestone.update({
            milestone_title: milestoneList.milestone_title.trim(),
            milestone_desc: milestoneList.milestone_desc.trim(),
            end_date: milestoneList.end_date
        }, {
            where: { proj_id: milestoneList.proj_id, milestone_id: milestoneList.milestone_id }
        });
        res.status(200).json({ message: "Milestone updated successfully", updatedData });
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "Error updating milestone", error: error.message });
    }
}

exports.DeleteMilestone = async (req, res) => {
    try {
        const { milestoneList } = req.body;

        const deleteData = await Milestone.update({
            is_active: 'N'
        }, {
            where: { proj_id: milestoneList.proj_id, milestone_id: milestoneList.milestone_id }
        });
        res.status(200).json({ message: "Milestone deleted succesfully", deleteData });
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "Error deleting milestone", error: error.message });
    }
}

exports.CompleteMilestone = async (req, res) => {
    try {
        const { milestoneList } = req.body;

        const ms = await Milestone.findOne({
            where: { proj_id: milestoneList.proj_id, milestone_id: milestoneList.milestone_id },
            attributes: ['is_active', 'is_completed']
        });

        if (ms.is_active === 'Y' && ms.is_completed === 'N') {
            const completeData = await Milestone.update({
                is_completed: 'Y'
            }, {
                where: { proj_id: milestoneList.proj_id, milestone_id: milestoneList.milestone_id }
            });
            res.status(200).json({ success: true, message: "Milestone marked as complete succesfully", completeData });
        } else {
            res.status(200).json({ success: false, message: "Failed to complete Milestone", completeData });
        }

    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "Error deleting milestone", error: error.message });
    }
}

exports.ProjMilestones = async (req, res) => {
    try {
        const { proj_id } = req.query;

        const projMilestoneData = await Milestone.findAll({
            where: {
                proj_id: proj_id
            }
        });

        const projData = await Project.findOne({
            where: {
                proj_id: proj_id
            }
        });

        return res.status(200).json({ message: 'Project Milestone(s) fetched successfully', projMilestoneData, projData });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching Project Milestone(s)', error: error.message });
    }
}

/**
 * access_val === 'S' -> User has Admin role and has access to Manage milestone(s)
 * access_val === 'SU' -> User is has supervisor role and has access to Manage milestone(s)
 * access_val === 'ST' -> User is has student role and has access to Create milestone(s) 
 * access_val === 'I' -> User is invalid
 */
exports.getUserRoleAccess = async (req, res) => {
    try {
        const { proj_id } = req.body;

        const user = req.user;
        const user_id = user.user_id;
        const role = Number(user.role);

        if (role === 1) {
            return res.status(200).json({ success: true, message: "Valid User", access_val: 'S' });
        } if (role === 3) {
            const supervisor_exists = await ProjectAllocation.count({
                where: {
                    proj_id: proj_id,
                    user_id: user_id,
                    role: role,
                    is_active: 'Y'
                }
            });

            if (supervisor_exists === 1) {
                return res.status(200).json({ success: true, message: "Valid User", access_val: 'SU' });
            } else {
                return res.status(200).json({ success: false, message: "Invalid User", access_val: 'I' });
            }
        } else if (role === 4) {
            const student = await ProjectAllocation.count({
                where: {
                    proj_id: proj_id,
                    user_id: user_id,
                    role: role,
                    is_active: 'Y'
                }
            });

            if (student === 1) {
                return res.status(200).json({ success: true, message: "Valid User", access_val: 'ST' });
            } else {
                return res.status(200).json({ success: false, message: "Invalid User", access_val: 'I' });
            }
        } else {
            return res.status(200).json({ success: false, message: "Invalid User", access_val: 'I' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching user role access', error: error.message });
    }
}

exports.ProjectProgress = async (req, res) => {
    try {
        const { proj_id } = req.query;

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

        const progress = Math.round(((completedMilestoneCount / activeMilestoneCount) * 100));

        const projProgressData = {
            proj_id: proj_id,
            progress: Number(progress)
        }

        return res.status(200).json({ message: "Project Milestone Progress fetched successfully", projProgressData });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching milestone progress", error: error.message });
    }
}

exports.ResumeMilestone = async (req, res) => {
    try {
        const { milestoneList } = req.body;

        const ms = await Milestone.findOne({
            where: { proj_id: milestoneList.proj_id, milestone_id: milestoneList.milestone_id },
            attributes: ['is_active', 'is_completed']
        });

        if (ms.is_active === 'Y' && ms.is_completed === 'Y') {
            const completeData = await Milestone.update({
                is_completed: 'N'
            }, {
                where: { proj_id: milestoneList.proj_id, milestone_id: milestoneList.milestone_id }
            });
            res.status(200).json({ success: true, message: "Milestone resumed succesfully", completeData });
        } else {
            res.status(200).json({ success: false, message: "Failed to resume milestone", completeData });
        }
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "Error deleting milestone", error: error.message });
    }
}

exports.filterProjMilestones = async (req, res) => {
    try {
        const { projName } = req.query;
        const user = req.user;

        if (projName && typeof projName !== "string") {
            return res.status(400).json({ message: "Invalid projName parameter" });
        }

        const filter_query = `
        SELECT pr.project_name, pr.proj_id
        FROM t_project pr, t_proj_allocation pa
        WHERE pr.project_name ILIKE '%' || :project_name || '%'
            and pa.proj_id = pr.proj_id
            and pa.user_id = :user_id
            and pa.is_active = 'Y'
		GROUP BY pr.project_name, pr.proj_id;`

        const replacements = {
            project_name: projName,
            user_id: user.user_id
        }

        const projects = await sequelize.query(filter_query, {
            type: sequelize.QueryTypes.SELECT,
            replacements,
        });

        res.status(200).json(projects);
    } catch (error) {
        console.error("Error filtering projects:", error);
        res
            .status(500)
            .json({ message: "Error filtering projects", error: error.message });
    }
};