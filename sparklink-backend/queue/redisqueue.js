const Queue = require('bull');

// Initialize the Bull queue
const skillQueue = new Queue('skill-extraction', {
  redis: { host: '127.0.0.1', port: 6371 }, // Update with your Redis host and port
});

module.exports = skillQueue;