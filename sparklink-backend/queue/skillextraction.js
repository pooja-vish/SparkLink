const Bull = require('bull');
const axios = require('axios');
const project = require('../models/project');
const { createClient } = require('@redis/client');  // Use @redis/client instead of 'redis'
const { response } = require('express');

// Create a Redis client
const redisClient = createClient({
  url: 'redis://127.0.0.1:6370',  // Correct port for Redis
});

// Set up Redis client
redisClient.on('connect', () => {
  console.log('Connected to Redis successfully!');
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

// Create a new queue for skill extraction
const skillQueue = new Bull('skill-extraction', {
  redis: {
    host: '127.0.0.1', // Redis host
    port: 6370,        // Redis port
  },
});

// Worker to process the job
skillQueue.process(async (job) => {
  const { projectId, projectDescription } = job.data;

  try {
    // Send the project description to the recommendation API
    const response = await axios.post('https://sparklink-recommendation.onrender.com/find_skills/', {
      description: projectDescription,
      top_n: 5, // You can adjust the top_n value as needed
    });

    // Extract the skills from the response
    const r_skills = response.data.required_skills || [];

    // Save the skills to the database
    await saveSkillsToDatabase(projectId, r_skills);
  



    console.log(`Skills for project ${projectId} with ${r_skills} have been saved successfully`);
  } catch (error) {
    console.error(`Error processing skill extraction for project ${projectId}:`, error);
    throw new Error('Error during skill extraction');
  }
});


// Function to save skills to the database
async function saveSkillsToDatabase(projectId, skills) {
  // Assuming you have a Skills model to save skills linked to the project
  // This is just an example, adjust it as needed
  const skillsString = skills.join(', ');
  await project.update(
    { skills_req: skillsString },
    { where: { proj_id: projectId } }
  );
  // Replace with your actual database saving logic
}




// Initialize Redis client
redisClient.connect().catch((err) => {
  console.error('Error connecting to Redis:', err);
});
module.exports = { skillQueue };
