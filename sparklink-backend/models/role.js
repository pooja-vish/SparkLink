// models/role.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  role_desc: {
    type: DataTypes.STRING(20), // Adjusted to match the DB
    allowNull: false,
  },
  is_active: {
    type: DataTypes.STRING(2), // Adjusted to match the DB
    allowNull: false,
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  modified_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  created_on: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  modified_on: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 't_rolesmst',
  timestamps: false,
});

module.exports = Role;
