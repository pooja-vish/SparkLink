const User = require('../models/user');
const bcrypt = require('bcrypt');

// Register a new user with role
exports.register = async (req, res) => {
  try {
    const { username, email, password, role, name, user_id } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      user_id : 2,
      username,
      email,
      name,
      password: hashedPassword,
      role, // Save the user's role
      is_active: 'Y', // Default value
      created_by: 1, // Adjust based on your requirements
      modified_by: 1 // Adjust based on your requirements
    });

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// Login user with role
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({ 
      message: 'Login successful', 
      user: { 
        user_id: user.user_id, 
        username: user.username, 
        email: user.email, 
        role: user.role // Include the user's role in the response
      } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};
