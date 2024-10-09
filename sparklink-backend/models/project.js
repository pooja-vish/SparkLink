const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');  

const Project = sequelize.define('Project', {
  proj_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  proj_desc: {
    type: DataTypes.STRING(250),
    allowNull: false,
  },
  skills_req: {
    type: DataTypes.STRING(250),
    allowNull: false,
  },
  budget: {
    type: DataTypes.NUMERIC(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 't_proj_status',  // Replace with your status table name if different
      key: 'status_id',
    },
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: true,  // If you want to allow nullable start_date
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: true,  // If you want to allow nullable end_date
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  created_on: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  modified_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  modified_on: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 't_usermst',  // Replace with your actual user table model name
      key: 'user_id',
    },
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'department',  // Replace with your actual department table model name
      key: 'department_id',
    },
  }
}, {
  tableName: 't_project',
  timestamps: false,  // If you're not using Sequelize's automatic timestamps
});

module.exports = Project;
