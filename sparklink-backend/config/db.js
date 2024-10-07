require('dotenv').config();
const { Sequelize } = require('sequelize');

// Initialize Sequelize with database credentials from the .env file
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,  // Adjust according to your DB setup
    },
  },
  pool: {
    max: 5,      // Maximum number of connection in pool
    min: 0,      // Minimum number of connection in pool
    acquire: 30000, // Maximum time, in ms, that pool will try to get connection before throwing error
    idle: 10000,  // The maximum time, in ms, that a connection can be idle before being released
  },
});

// Test the connection
sequelize.authenticate().then(() => {
  console.log('Database connected...');
}).catch(err => {
  console.log('Error: ' + err);
});

module.exports = sequelize;
