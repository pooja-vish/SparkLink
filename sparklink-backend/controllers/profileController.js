const Student_profile = require('../models/student_profile');
const Supervisor_profile = require('../models/supervisor_profile');
const Owner_profile = require('../models/owner_profile');
const ProjAllocation = require("../models/proj_allocation");
const User = require('../models/user');
const Role = require('../models/role');
const Project = require('../models/project');

exports.getProfile = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Fetch the user and their role
    const user = await User.findOne({
      where: { user_id },
      attributes: ['role'], // Only fetch the role field
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
    let profile,projects;
    if (roleDesc === 'student') {
      profile = await Student_profile.findOne({ where: { user_id } });
      projects = await ProjAllocation.findAll({
        where: {
          user_id: user_id,   
          role: 4,  
        },
      });
    } else if (roleDesc === 'supervisor') {
      profile = await Supervisor_profile.findOne({ where: { user_id } });
      projects = await ProjAllocation.findAll({
        where: {
          user_id: user_id,   
          role: 3,  
        },
      });
    } else if (roleDesc === 'business_owner') {
      profile = await Owner_profile.findOne({ where: { user_id } });
      projects = await ProjAllocation.findAll({
        where: {
          user_id: user_id,   
          role: 2,  
        },
      });
    } else {
      
      return res.status(400).json({ message: "Invalid role" });
    }

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Fetch the projects for the user
    // const projects = await ProjAllocation.findAll({
    //   where: { user_id },
    //   attributes: ['id', 'role'], 
    // });

    res.status(200).json({
      message: 'Profile and projects fetched successfully',
      profile,
      projects,
      role: roleDesc,
    });
  } catch (err) {
    console.error("Error fetching profile and projects:", err);
    res.status(500).json({ message: 'Error fetching profile and projects', error: err.message });
  }
};
