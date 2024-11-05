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
    is_completed: {
        type: DataTypes.CHAR(1),
        allowNull: false,
        defaultValue: 'N',
        validate: {
            isIn: [['Y', 'N']],
        },
    },
    milestone_title: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    is_active: {
        type: DataTypes.CHAR(1),
        allowNull: false,
        defaultValue: 'Y',
        validate: {
            isIn: [['Y', 'N']]
        }
    }
}, {
    tableName: 't_proj_milestone',
    timestamps: false,
});

module.exports = ProjectMilestone;