const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("../models/user");
const Project = require("../models/project");

/**
 * Primary key (id)
 * Unique Index [proj_id, user_id, role where is_active = 'Y']
 */

const ProjApplication = sequelize.define(
  "ProjApplication",
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
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "t_rolesmst",
        key: "id",
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "t_usermst",
        key: "user_id",
      },
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
      defaultValue: "Y",
      validate: {
        isIn: [["Y", "N"]],
      },
    },
    is_approved: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: "N",
      validate: {
        isIn: [["Y", "N"]],
      },
    },
    is_rejected: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: "N",
      validate: {
        isIn: [["Y", "N"]],
      },
    },
  },
  {
    tableName: "t_proj_application",
    timestamps: false,
    indexes: [
      {
        name: "t_proj_application_active_unique",
        unique: true,
        fields: ["proj_id", "user_id", "role"],
        where: {
          is_active: 'Y'
        }
      },
    ],
  }
);

ProjApplication.belongsTo(User, {
  foreignKey: "user_id",
  targetKey: "user_id",
  as: "user",
});
User.hasMany(ProjApplication, { foreignKey: "user_id", as: "applications" });

ProjApplication.belongsTo(Project, {
  foreignKey: "proj_id",
  targetKey: "proj_id",
  as: "project",
});
Project.hasMany(ProjApplication, { foreignKey: "proj_id", as: "applications" });

module.exports = ProjApplication;
