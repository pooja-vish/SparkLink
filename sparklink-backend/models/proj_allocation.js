const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

/**
 * Primary key (id)
 * Unique Index [proj_id, user_id, role where is_active = 'Y']
 */

const ProjAllocation = sequelize.define(
  "ProjAllocation",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    proj_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "t_project",
        key: "proj_id",
      },
      onUpdate: "NO ACTION",
      onDelete: "NO ACTION",
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "t_usermst",
        key: "user_id",
      },
      onUpdate: "NO ACTION",
      onDelete: "NO ACTION",
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "t_rolesmst",
        key: "id",
      },
      onUpdate: "NO ACTION",
      onDelete: "NO ACTION",
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("NOW()"),
    },
    modified_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    modified_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("NOW()"),
    },
    is_active: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: 'Y',
      validate: {
        isIn: [['Y', 'N']],
      },
    },
    notification: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: 'Y',
      validate: {
        isIn: [['Y', 'N']],
      },
    },
  },
  {
    tableName: "t_proj_allocation",
    timestamps: false,
    indexes: [
      {
        name: "t_proj_allocation_active_unique",
        unique: true,
        fields: ["proj_id", "user_id", "role"],
        where: {
          is_active: 'Y'
        }
      },
    ],
  }
);

module.exports = ProjAllocation;
