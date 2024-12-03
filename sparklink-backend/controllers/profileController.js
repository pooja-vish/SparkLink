const Student_profile = require('../models/student_profile');
const Supervisor_profile = require('../models/supervisor_profile');
const Owner_profile = require('../models/owner_profile');
const ProjAllocation = require("../models/proj_allocation");
const ProjectStatus = require("../models/proj_status");
const User = require('../models/user');
const Role = require('../models/role');
const Project = require('../models/project');
const { Op } = require("sequelize");
const sequelize = require('../config/db');
const { getTop5RecommendedProjects } = require("../queue/skillextraction");

exports.getProfile = async (req, res) => {
  try {
    const { user_id } = req.query;
    //const user_id = req.user.user_id;

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Fetch the user and their role
    const user = await User.findOne({
      where: { user_id },
      attributes: ['role','email','name','username'], // Only fetch the role field
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("==user.role==",user.role);
    const role = await Role.findOne({
      where: { id: user.role },
      attributes: ['role_desc'], // Only fetch the role description
    });

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    const roleDesc = role.role_desc;
    console.log(`Role: ${roleDesc}`);

    // Fetch the profile based on the role
    let profile,projects,project_details,projIds,role_id;
    if (roleDesc === 'student') {
      profile = await Student_profile.findOne({ where: { user_id } });
      // projects = await ProjAllocation.findAll({
      //   where: {
      //     user_id: user_id,   
      //     role: 4,  
      //   },
      // });
      role_id = 4;
    } else if (roleDesc === 'supervisor') {
      profile = await Supervisor_profile.findOne({ where: { user_id } });
      // projects = await ProjAllocation.findAll({
      //   where: {
      //     user_id: user_id,   
      //     role: 3,  
      //   },
      // });
      role_id = 3;
    } else if (roleDesc === 'business_owner') {
      profile = await Owner_profile.findOne({ where: { user_id } });
      // projects = await ProjAllocation.findAll({
      //   where: {
      //     user_id: user_id,   
      //     role: 2,  
      //   },
      // });
      role_id = 2;
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    } 
    // if(projects){
    //   projIds = projects.map(project => project.proj_id);
    //   console.log(">>>>>>>>>project ids = ", projIds);
    // }else{
    //   return res.status(404).json({ message: "Projects not found" });
    // }
    // project_details = await Project.findAll({
    //   where: {
    //     proj_id: {
    //       [Op.in]: projIds, // Filters projects where proj_id is in the projIds array
    //     },
    //   },
    // });
    project_details = await ProjAllocation.findAll({
      where: {
        user_id,
        role: role_id,
      },
      include: [
        {
          model: Project,
          as: 'project', // Use the alias defined in the association
        },
      ],
    });
   if (project_details && project_details.length > 0) {
      for (let i = 0; i < project_details.length; i++) {
        let proj_id = project_details[i].proj_id;

        const status_query = `select ps.status_desc
          from t_project pr, t_proj_status ps
          where pr.status = ps.status_id
          and pr.proj_id = :proj_id;`;

        const [statusResult] = await sequelize.query(status_query, {
          replacements: { proj_id }, // Replaces :projId with the actual value
          type: sequelize.QueryTypes.SELECT, // Specifies the query type
        });

        const status_desc = statusResult ? statusResult.status_desc : null;

        project_details[i].setDataValue('status_desc', status_desc || '');
      }    
    }
    // Fetch the projects for the user
    // const projects = await ProjAllocation.findAll({
    //   where: { user_id },
    //   attributes: ['id', 'role'], 
    // });

    res.status(200).json({
      message: 'Profile and projects fetched successfully',
      user_details: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        name: user.name,
        isAuthenticated: true,
      },
      profile,
      projects,
      project_details,
      role: roleDesc,
    });
  } catch (err) {
    console.error("Error fetching profile and projects:", err);
    res.status(500).json({ message: 'Error fetching profile and projects', error: err.message });
  }
};
