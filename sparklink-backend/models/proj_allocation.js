const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

/**
 * Composite Primary key (proj_id, project_owner)
 * Foreign key (proj_id)
 * Foreign key (project_owner)
 * Foreign key (student)
 * Foreign key (supervisor)
 */

const ProjAllocation = sequelize.define('ProjAllocation', {
    proj_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 't_project',
            key: 'proj_id',
        },
    },
    project_owner: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 't_usermst',
            key: 'user_id',
        },
    },
    supervisor: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 't_usermst',
            key: 'user_id',
        },
    },
    student: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 't_usermst',
            key: 'user_id',
        },
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    created_on: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('NOW()'),
    },
    modified_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    modified_on: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('NOW()'),
    },
}, {
    tableName: 't_proj_allocation',
    timestamps: false,
});

module.exports = ProjAllocation;