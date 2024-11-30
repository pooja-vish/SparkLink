const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ProjectReport = sequelize.define('ProjectReport', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    proj_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 't_project',
            key: 'proj_id'
        },
        onUpdate: 'NO ACTION',
        onDelete: 'NO ACTION'
    },
    reported_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 't_usermst',
            key: 'user_id'
        },
        onUpdate: 'NO ACTION',
        onDelete: 'NO ACTION'
    },
    report_count: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    reason: {
        type: DataTypes.STRING(250),
        allowNull: false
    }
}, {
    tableName: 't_proj_report',
    timestamps: false
});

module.exports = ProjectReport;