// models/user.js
const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/db');
const Role = require('./role'); // Import Role model to establish associations

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  role: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Role, // refers to Role model
      key: 'role_id',
    },
  },
  name: {
    type: DataTypes.STRING(250),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(250),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(64),
    allowNull: false,
  },
  is_active: {
    type: DataTypes.STRING(2),
    allowNull: false,
    defaultValue: 'Y',
  },
  created_on: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  modified_on: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 't_usermst',
  timestamps: false,
  hooks: {
    beforeCreate: async (user) => {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    },
    beforeUpdate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
  },
});

// Method to validate password
User.prototype.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Associate User with Role (one-to-many relationship)
User.belongsTo(Role, { foreignKey: 'role' });

module.exports = User;
