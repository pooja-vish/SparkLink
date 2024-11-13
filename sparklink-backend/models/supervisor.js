const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/db');

const SupervisorProfile = sequelize.define('SupervisorProfile', {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 't_usermst', // Assuming 'UserMst' is the model for 't_usermst'
        key: 'user_id'
      }
    },
    department: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    domain: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    is_project_owner: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false   
  
    }
  }, {
    tableName: 't_supervisor_profile',
    timestamps: true,
  });
  
module.exports = SupervisorProfile;