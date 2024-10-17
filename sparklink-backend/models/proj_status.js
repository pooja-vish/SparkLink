const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Assuming you have a Sequelize instance configured

const ProjectStatus = sequelize.define('ProjectStatus', {
  status_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  status_desc: {
    type: DataTypes.STRING(250),
    allowNull: false
  }
}, {
    tableName: 't_proj_status',
    timestamps: false,
  });

module.exports = ProjectStatus;
