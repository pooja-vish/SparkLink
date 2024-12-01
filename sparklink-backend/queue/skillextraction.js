const Bull = require('bull');
const axios = require('axios');

// Create a new queue for skill extraction
const skillQueue = new Bull('skill-extraction', {
  redis: {
    host: '127.0.0.1', // Replace with your Redis host
    port: 6371, // Replace with your Redis port
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
    const skills = response.data.required_skills || [];

    // Save the skills to the database (you'll need a Skills model for this)
    //await saveSkillsToDatabase(projectId, skills);

    console.log(`Skills for project ${projectId} with ${skills} have been saved successfully`);
  } catch (error) {
    console.error(`Error processing skill extraction for project ${projectId}:`, error);
    throw new Error('Error during skill extraction');
  }
});

// Function to save skills to the database
// async function saveSkillsToDatabase(projectId, skills) {
//   // Assuming you have a Skills model to save skills linked to the project
//   // This is just an example, adjust it as needed
//   const skillData = skills.map(skill => ({
//     project_id: projectId,
//     skill_name: skill,
//     created_at: new Date(),
//     updated_at: new Date(),
//   }));

//   // Replace with your actual database saving logic
//   await Skill.bulkCreate(skillData);
// }

module.exports = skillQueue;
