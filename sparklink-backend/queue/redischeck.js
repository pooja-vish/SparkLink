const { createClient } = require('@redis/client'); // Use the latest Redis client

// Create a Redis client
const redisClient = createClient({
  url: 'redis://127.0.0.1:6370', // Change to the correct port if needed (6379 is default)
});

redisClient.on('connect', () => {
  console.log('Connected to Redis successfully!');
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

// Connect to Redis before running any commands
redisClient.connect().catch((err) => {
  console.error('Error connecting to Redis:', err);
});

// Test setting a key-value pair
async function testRedis() {
  try {
    // Set key-value pair
    const reply = await redisClient.set('test_key', 'test_value');
    console.log('Set key reply:', reply); // Expected: "OK"

    // Retrieve the key-value pair
    const value = await redisClient.get('test_key');
    console.log('Retrieved value from Redis:', value); // Expected: "test_value"
  } catch (err) {
    console.error('Error with Redis operations:', err);
  } finally {
    // Close the Redis connection after the commands are done
    await redisClient.quit();
  }
}

testRedis();
