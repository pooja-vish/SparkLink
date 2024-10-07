// controllers/userController.js
const { User, Role } = require('../models'); // Import User and Role models

// User Registration
const register = async (req, res) => {
  const { username, password, email, role, name } = req.body;
  try {
    // Check if role exists
    const userRole = await Role.findOne({ where: { role_id: role } });
    if (!userRole) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Create a new user
    const newUser = await User.create({ username, password, email, role, name });

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// User Login
const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const validPassword = await user.validPassword(password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred during login' });
  }
};

module.exports = { register, login };
