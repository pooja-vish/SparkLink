const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');  

const Project = sequelize.define('Project', {
  proj_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  project_name: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  proj_desc: {
    type: DataTypes.STRING(250),
    allowNull: false,
  },
  skills_req: {
    type: DataTypes.STRING(250),
    allowNull: true,
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
    default: null
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
  image_url: {
    type: DataTypes.STRING,  // Store the image URL as a string
    allowNull: false,  // Ensure an image URL is always provided
  }
}, {
  tableName: 't_project',
  timestamps: false,  // If you're not using Sequelize's automatic timestamps
});

module.exports = Project;
