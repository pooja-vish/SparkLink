const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("../models/user");
const Project = require("../models/project");

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
    b_notification: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: 'Y',
      validate: {
        isIn: [['Y', 'N']],
      },
    },
    s_notification: {
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

ProjAllocation.belongsTo(User, {
  foreignKey: "user_id",
  targetKey: "user_id",
  as: "user",
});
User.hasMany(ProjAllocation, { foreignKey: "user_id", as: "allocations" });

ProjAllocation.belongsTo(Project, {
  foreignKey: "proj_id",
  targetKey: "proj_id",
  as: "project",
});
Project.hasMany(ProjAllocation, { foreignKey: "proj_id", as: "allocations" });

module.exports = ProjAllocation;
