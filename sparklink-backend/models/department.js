// models/department.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Import your database connection

const Department = sequelize.define('Department', {
  department_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  department_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, {
  tableName: 'department',
  timestamps: false, // If you don't need createdAt and updatedAt fields
});

module.exports = Department;
