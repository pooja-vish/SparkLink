const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/db');

const Supervisor_Profile = sequelize.define('Supervisor_Profile', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 't_usermst',
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
  },
  bio: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  expertise: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  education: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  experience: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  phone_number: {
    type: DataTypes.STRING(15),
    allowNull: true,
  },
  github: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  linkedin: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  course: {
    type: DataTypes.STRING(100),
    allowNull: true
}
}, {
  tableName: 't_supervisor_profile',
  timestamps: false,
});

module.exports = Supervisor_Profile;