const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/db');
// const ProjAllocation = require('../models/proj_allocation');

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
  confirmation_token: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  role: {
    type: DataTypes.STRING(50),
    allowNull: false,
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
    type: DataTypes.STRING(64), // or DataTypes.TEXT
    allowNull: false,
  },
  is_active: {
    type: DataTypes.STRING(2),
    allowNull: false,
    defaultValue: 'Y',
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  created_on: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  modified_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  modified_on: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  resetpasswordtoken:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  resetpasswordexpires:{
    type: DataTypes.DATE,
    allowNull: true,
  }
  
}, {
  tableName: 't_usermst',
  timestamps: false, // Change to true if you want automatic timestamps
  hooks: {
    beforeCreate: async (user) => {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) { // Only hash if password is changing
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
  },
});

// Method to validate password
User.prototype.validPassword = async function (password) {
  console.log(password + "Hashed password:" +this.password)
  return await bcrypt.compare(password, this.password);
};


// User.hasMany(ProjAllocation, {
//   foreignKey: 'user_id',  // Correct foreign key used in ProjAllocation
//   as: 'projectAllocations', // Alias for the association
// });


module.exports = User;

