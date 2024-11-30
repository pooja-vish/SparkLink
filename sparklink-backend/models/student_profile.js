const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require("../models/user");

const Student_Profile = sequelize.define('Student_Profile', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "t_usermst",
          key: "user_id",
        },
      },
    skills: {
        type: DataTypes.STRING(250),
        allowNull: true,
    },
    profile_name: {
        type: DataTypes.STRING(250),
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
    bio: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    education: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    experience: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    course: {
        type: DataTypes.STRING(100),
        allowNull: true
    }
}, {
    tableName: 't_student_profile',  
    timestamps: false     
});

module.exports = Student_Profile;
