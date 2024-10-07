// Load environment variables from .env
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/db'); // Import the database connection
const userRoutes = require('./routes/userRoutes'); // Import your user routes
 // Import your role routes

const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON bodies

// Sync database
sequelize.sync().then(() => {
  console.log('Database synced successfully');
}).catch(err => {
  console.error('Database sync failed:', err);
});

// Define routes
app.use('/api/users', userRoutes); // Route for user-related requests
 // Route for role-related requests

// Test database connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connected...');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
