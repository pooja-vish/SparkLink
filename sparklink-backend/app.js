// Load environment variables from .env
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/db'); // Import the database connection
const userRoutes = require('./routes/userRoutes'); // Import your user routes
const roleRoutes = require('./routes/roleRoutes'); // Import your role routes
const projectStatusRouter = require('./routes/projectStatusRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const projectRouter = require('./routes/projectRoutes');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 // Enable CORS
app.use(bodyParser.json()); // Parse JSON bodies

// Test database connection first
sequelize.authenticate()
  .then(() => {
    console.log('Database connected...');

    // Sync database after successful authentication
    return sequelize.sync();
  })
  .then(() => {
    console.log('Database synced successfully');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Define routes
app.use('/api/users', userRoutes); // Route for user-related requests
app.use('/api', roleRoutes); // Route for role-related requests
app.use('/projectstatus', projectStatusRouter);
app.use('/department', departmentRoutes);
app.use('/project', projectRouter);
// Error handling middleware


// Start the server
const PORT = 5000; // Allow for dynamic port assignment if needed
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
