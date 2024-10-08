// testConnection.js

require('dotenv').config(); // Load environment variables from .env
const db = require('./config/db');  // Import your db.js

// Test function to check database connection
async function testDBConnection() {
  try {
    const res = await db.query('SELECT NOW()'); // Simple query to check connection
    console.log('Connection successful:', res.rows[0].now); // Log the current time from the DB
  } catch (err) {
    console.error('Connection error:', err.message); // Log the error if connection fails
  }
}

testDBConnection();
