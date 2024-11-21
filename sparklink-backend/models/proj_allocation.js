const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

/**
 * Composite Primary key (proj_id, user_id)
 * Foreign key (proj_id)
 * Foreign key (user_id)
 * Foreign key (role)
 */

const ProjAllocation = sequelize.define(
  "ProjAllocation",
  {
    proj_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "t_project",
        key: "proj_id",
      },
      onUpdate: "NO ACTION",
      onDelete: "NO ACTION",
      primaryKey: true,
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
      primaryKey: true,
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
  },
  {
    tableName: "t_proj_allocation",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["proj_id", "user_id"], // Composite primary key
      },
    ],
  }
);

module.exports = ProjAllocation;
