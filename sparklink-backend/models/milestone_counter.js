const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const MilestoneCounter = sequelize.define('MilestoneCounter', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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
  milestone_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
}, {
  tableName: 't_milestone_counter',
  timestamps: false
});

module.exports = MilestoneCounter;
