const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require("../models/user");

const Owner_Profile = sequelize.define('Owner_Profile', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 't_usermst', // Assuming 'UserMst' is the model for 't_usermst'
            key: 'user_id'
        }
    },
    business_type: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    domain_type: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    bio: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    phone_number: {
        type: DataTypes.STRING(15),
        allowNull: true
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    github: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    linkedin: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
 }, {
    tableName: 't_owner_profile',
    timestamps: false,
});

module.exports = Owner_Profile;
