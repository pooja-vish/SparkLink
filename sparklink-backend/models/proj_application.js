const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

/**
 * Composite Primary key (proj_id, role, user_id)
 * Foreign key (proj_id)
 * Foreign key (role)
 * Foreign key (user_id)
 */

const ProjApplication = sequelize.define('ProjApplication', {
    proj_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 't_project',
            key: 'proj_id',
        },
    },
    role: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 't_rolesmst',
            key: 'id',
        },
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
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
    is_active: {
        type: DataTypes.CHAR(1),
        allowNull: false,
        defaultValue: 'Y',
        validate: {
            isIn: [['Y', 'N']]
        }
    },
    is_approved: {
        type: DataTypes.CHAR(1),
        allowNull: false,
        defaultValue: 'N',
        validate: {
            isIn: [['Y', 'N']],
        },
    }
}, {
    tableName: 't_proj_application',
    timestamps: false,
});

module.exports = ProjApplication;
