const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Adjust the path to your db configuration

const Image = sequelize.define('Image', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  image_url: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  tableName: 't_images', // Explicitly specify the table name
  timestamps: false, // Disable automatic `createdAt` and `updatedAt` fields
});

module.exports = Image;
