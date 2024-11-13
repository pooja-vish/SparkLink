require('dotenv').config();
const User = require('../models/user');
const SupervisorProfile = require('../models/supervisor');

const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const passport = require('passport');

// Register a new user with role



exports.register = async (req, res) => {
  try {
    const { username, email, password, name, isSupervisor, isBusinessOwner } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a unique confirmation token
    const confirmationToken = crypto.randomBytes(32).toString('hex');

    // Create a new user with is_active set to 'N' initially
    const newUser = await User.create({  
      username,
      email,
      name,
      password: password,
      role: isSupervisor && isBusinessOwner ? '2,3' : (isSupervisor ? '2' : (isBusinessOwner ? '3' : '4')),
      is_active: 'N', // User initially inactive
      created_by:  isSupervisor && isBusinessOwner ? '2,3' : (isSupervisor ? '2' : (isBusinessOwner ? '3' : '4')),
      modified_by:  isSupervisor && isBusinessOwner ? '2,3' : (isSupervisor ? '2' : (isBusinessOwner ? '3' : '4')),
      confirmation_token: confirmationToken, // Save the token to the database
    });


    if (isSupervisor && isBusinessOwner) {
      await SupervisorProfile.create({
        user_id: newUser.user_id,
        is_verified: false,
        is_project_owner: true
      });
    }
    else if (isSupervisor){
      await SupervisorProfile.create({
        user_id: newUser.user_id,
        is_verified: false,
        is_project_owner: false,
      });
    }
    // Send a confirmation email with the link
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
         user: process.env.EMAIL_USER,
         pass: process.env.EMAIL_PASS,
      },
      tls: {
         // Do not fail on invalid certs
         rejectUnauthorized: false
      }
    });

    const confirmationLink = `http://localhost:5100/api/users/confirm-email?token=${confirmationToken}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Confirm Your Email',
      text: `Please click the following link to confirm your email: ${confirmationLink}`,
    });
    
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

  //  res.status(200).json({ message: 'Email confirmed successfully. You can now log in.' });
    return res.redirect("http://localhost:3100/login?message=Email confirmed successfully. You can now log in.");
  } catch (error) {
    res.status(500).json({ message: 'Error confirming email', error: error.message });
  }
};

exports.registerSupervisor= async(req,res) => {

}


// Login user with role
exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: 'Authentication error', error: err });
    }
    if (!user) {
      return res.status(401).json({ message: info.message || 'Invalid credentials' });
    }

    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Login failed', error: err });
      }

      // Send success message, user data, and redirect URL in the response
      return res.status(200).json({
        message: 'Login successful',
        user: {
          username: user.username,
          email: user.email,
          role: user.role,
          isAuthenticated: true,
        },
        // Adjust this to the desired path
      });
    });
  })(req, res, next);
};
// Logout Controller
exports.logout = (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'User not logged in' });

  req.logout((err) => {
    if (err) return res.status(500).json({ message: 'Error while logging out', error: err });

    req.session.destroy((err) => {
      if (err) return res.status(500).json({ message: 'Error while destroying session', error: err });
      return res.status(200).json({ message: 'Logged out successfully' });
    });
  });
};

exports.checkSession = (req, res) => {
  if (req.isAuthenticated()) {
    // User is authenticated, send back user details
    const { username, email, role } = req.user; // Assuming req.user contains these fields
    return res.status(200).json({
      isAuthenticated: true,
      user: { username, email, role }
    });
  } else {
    // User is not authenticated
    return res.status(200).json({
      isAuthenticated: false
    });
  }
};

exports.authStatus = (req, res) => {
  if (req.isAuthenticated()) {
    if(req.user.role === '1' || req.user.role === '2' || req.user.role === '1,2'){
    console.log("hi");
    return res.status(200).json({ isAuthenticated: true, user: req.user });
    }
    else{
      return res.status(501).json({ isAuthenticated: false, user: req.user });
    }
  } else {
    console.log("heyyy");
    return res.status(200).json({ isAuthenticated: false });
    
  }
};


exports.authStatusSupervisorOrAdmin = (req, res) => {
  if (req.isAuthenticated()) {
    if(req.user.role === '1' || req.user.role === '2')
    console.log("hi");
    return res.status(200).json({ isAuthenticated: true, user: req.user });
   
  } else {
    console.log("heyyy");
    return res.status(200).json({ isAuthenticated: false });
    
  }
};

exports.forgotPassword= async (req, res) =>{
  try{
  const {email} = req.body;
  const user = await User.findOne({where : { email }});
  if(!user){
    return res.status(404).json({message: 'User With TThis Email Does not Exist'});
  }
  const reset_token = crypto.randomBytes(32).toString('hex');
  const reset_token_expires = new Date(Date.now + 3600000);

  user.resetPasswordToken = reset_token;
  user.resetPasswordExpires = reset_token_expires;
  user.save();
  const resetLink = `http://localhost:5100/reset-password?token=${resetToken}`;


  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Password Reset Request',
    text: `Please click on this link to reset your password: ${resetLink}`,
  })
  res.status(200).json({message: 'Password reet link snet. check your emial'});
}
  catch(error){
    res.status(500).json({ message: 'Error in password reset', error: error.message });
  }
};

exports.resetPassword = async(req, res)=>{
  try{
    const { token } = req.query;
    const { newPassword }= req.body;

    const user = await User.findOne({
      where: {
        resetPasswordToken : token,
        resetPasswordExpires: {[Op.gt]: new Date()},
      },
    });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword,
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    res.status(200).json({ message: 'Password reset successfully. You can now log in.' });
  }catch (error) {
    res.status(500).json({ message: 'Error resetting password', error: error.message });
  }

};


