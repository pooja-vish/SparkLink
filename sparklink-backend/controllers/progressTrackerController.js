const Milestone = require('../models/proj_milestone');
const MilestoneCounter = require('../models/milestone_counter');

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
                milestone_desc
            } = milestone;

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
                    milestone_desc: milestone_desc
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

        const milestoneData = await Milestone.findAll({ where: { proj_id: proj_id } });
        res.status(200).json({ message: "Milestone(s) fetched successfully", milestoneData });
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "Error fetching project milestone(s)", error: error.message });
    }
}