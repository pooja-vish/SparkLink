const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

/**
 * Composite Primary Key (proj_id, milestone_id)
 * Foreign Key proj_id reference (proj_id in t_project)
 */

const ProjectMilestone = sequelize.define('ProjectMilestone', {
    proj_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 't_project',
            key: 'proj_id',
        },
    },
    milestone_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    milestone_desc: {
        type: DataTypes.STRING(250),
        allowNull: false,
    },
}, {
    tableName: 't_proj_milestone',
    timestamps: false,
});

module.exports = ProjectMilestone;