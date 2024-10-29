const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ProgressTracker = sequelize.define('ProgressTracker', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    project_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 't_proj_milestone',
            key: 'proj_id'
        },
    },
    milestone_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 't_proj_milestone',
            key: 'milestone_id'
        },
    },
    supervisor_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    project_owner: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    created_on: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    modified_by: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    modified_on: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
}, {
    tableName: 't_progress_tracker',
    timestamps: false
});

module.exports = ProgressTracker;