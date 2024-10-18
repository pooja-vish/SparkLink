// controllers/roleController.js
const Role = require('../models/role');

// Controller to add a new role
exports.addRole = async (req, res) => {
  const { role_desc, is_active, created_by } = req.body; // Include the new fields

  try {
    // Create a new role in the database
    const newRole = await Role.create({
      role_desc,
      is_active,
      created_by,
      modified_by: created_by, // For simplicity, setting modified_by same as created_by
    });
    res.status(201).json({
      message: 'Role created successfully',
      role: newRole,
    });
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({
      message: 'Error creating role',
      error: error.message,
    });
  }
};

// Controller to fetch all roles
exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.status(200).json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({
      message: 'Error fetching roles',
      error: error.message,
    });
  }
};
