require('dotenv').config();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Register a new user with role



function isPasswordValid(password) {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

// Email validation function
function isEmailValid(email) {
  return email.endsWith('@uwindsor.ca');
}

// Check if username exists in the database
async function isUsernameTaken(username) {
  const user = await User.findOne({ where: { username } });
  return !!user;
}

// Send confirmation email function
async function sendConfirmationEmail(email, token) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    }
  });

  const confirmationLink = `http://localhost:5100/confirm-email?token=${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Confirm Your Email',
    text: `Please click the following link to confirm your email: ${confirmationLink}`,
  });
}

// Main registration function
exports.register = async (req, res) => {
  try {
    const { username, email, password, role, name } = req.body;

    // Check if email ends with @uwindsor.ca
    if (!isEmailValid(email)) {
      return res.status(400).json({ message: 'Email must be a University of Windsor email address (ending in @uwindsor.ca).' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already in use.' });
    }

    // Check if username already exists
    if (await isUsernameTaken(username)) {
      return res.status(400).json({ message: 'Username is already taken.' });
    }

    // Validate password
    if (!isPasswordValid(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long, contain at least one number, and one special character.',
      });
    }

    // Hash the password
    

    // Generate a unique confirmation token
    const confirmationToken = crypto.randomBytes(32).toString('hex');

    // Create a new user with is_active set to 'N' initially
    const newUser = await User.create({
      username,
      email,
      name,
      password: password,
      role,
      is_active: 'N', // User initially inactive
      created_by: 1,
      modified_by: 1,
      confirmation_token: confirmationToken,
    });

    // Send a confirmation email
    await sendConfirmationEmail(email, confirmationToken);

    res.status(201).json({ message: 'User registered successfully. Please check your email to confirm your account.' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};


exports.confirmEmail = async (req, res) => {
  try {
    const { token } = req.query;

    // Find the user by confirmation token
    const user = await User.findOne({ where: { confirmation_token: token } });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Activate the user account
    user.is_active = 'Y';
    user.confirmation_token = null; // Clear the token after confirmation
    await user.save();

    res.status(200).json({ message: 'Email confirmed successfully. You can now log in.' });
  } catch (error) {
    res.status(500).json({ message: 'Error confirming email', error: error.message });
  }
};

exports.registerSupervisor= async(req,res) => {

}

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
      console.log("npt a match")
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
