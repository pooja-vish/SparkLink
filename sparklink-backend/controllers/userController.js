require("dotenv").config();
const User = require("../models/user");
const SupervisorProfile = require("../models/supervisor_profile");

const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const passport = require("passport");
const { Op } = require("sequelize");

// Register a new user with role

exports.register = async (req, res) => {
  try {
    const { username, email, password, name, isSupervisor, isBusinessOwner } =
      req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a unique confirmation token
    const confirmationToken = crypto.randomBytes(32).toString("hex");

    // Create a new user with is_active set to 'N' initially
    const newUser = await User.create({
      username,
      email,
      name,
      password: password,
      role:
        isSupervisor && isBusinessOwner
          ? "2,3"
          : isSupervisor
          ? "2"
          : isBusinessOwner
          ? "3"
          : "4",
      is_active: "N", // User initially inactive
      created_by:
        isSupervisor && isBusinessOwner
          ? "2,3"
          : isSupervisor
          ? "2"
          : isBusinessOwner
          ? "3"
          : "4",
      modified_by:
        isSupervisor && isBusinessOwner
          ? "2,3"
          : isSupervisor
          ? "2"
          : isBusinessOwner
          ? "3"
          : "4",
      confirmation_token: confirmationToken, // Save the token to the database
    });

    if (isSupervisor && isBusinessOwner) {
      await SupervisorProfile.create({
        user_id: newUser.user_id,
        is_verified: false,
        is_project_owner: true,
      });
    } else if (isSupervisor) {
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
        rejectUnauthorized: false,
      },
    });

    const confirmationLink = `http://localhost:5100/api/users/confirm-email?token=${confirmationToken}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Confirm Your Email",
      text: `Please click the following link to confirm your email: ${confirmationLink}`,
    });

    res
      .status(201)
      .json({
        message:
          "User registered successfully. Please check your email to confirm your account.",
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

exports.confirmEmail = async (req, res) => {
  try {
    const { token } = req.query;

    // Find the user by confirmation token
    const user = await User.findOne({ where: { confirmation_token: token } });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Activate the user account
    user.is_active = "Y";
    user.confirmation_token = null; // Clear the token after confirmation
    await user.save();

    //  res.status(200).json({ message: 'Email confirmed successfully. You can now log in.' });
    return res.redirect(
      "http://localhost:3100/login?message=Email confirmed successfully. You can now log in."
    );
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error confirming email", error: error.message });
  }
};

exports.registerSupervisor = async (req, res) => {};

// Login user with role
exports.login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Authentication error", error: err });
    }
    if (!user) {
      return res
        .status(401)
        .json({ message: info.message || "Invalid credentials" });
    }

    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ message: "Login failed", error: err });
      }

      // Send success message, user data, and redirect URL in the response
      return res.status(200).json({
        message: "Login successful",
        user: {
          username: user.username,
          email: user.email,
          role: user.role,
          isAuthenticated: true,
          user_id: user.user_id,
        },
        // Adjust this to the desired path
      });
    });
  })(req, res, next);
};
// Logout Controller
exports.logout = (req, res) => {
  if (!req.user) return res.status(401).json({ message: "User not logged in" });

  req.logout((err) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Error while logging out", error: err });

    req.session.destroy((err) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Error while destroying session", error: err });
      return res.status(200).json({ message: "Logged out successfully" });
    });
  });
};

exports.checkSession = (req, res) => {
  if (req.isAuthenticated()) {
    // User is authenticated, send back user details
    const { username, email, role } = req.user; // Assuming req.user contains these fields
    return res.status(200).json({
      isAuthenticated: true,
      user: { username, email, role },
    });
  } else {
    // User is not authenticated
    return res.status(200).json({
      isAuthenticated: false,
    });
  }
};

exports.authStatus = (req, res) => {
  if (req.isAuthenticated()) {
    if (
      req.user.role === "1" ||
      req.user.role === "2" ||
      req.user.role === "1,2"
    ) {
      console.log("hi");
      return res.status(200).json({ isAuthenticated: true, user: req.user });
    } else {
      return res.status(501).json({ isAuthenticated: false, user: req.user });
    }
  } else {
    console.log("heyyy");
    return res.status(200).json({ isAuthenticated: false });
  }
};

exports.authStatusSupervisorOrAdmin = (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.role === "1" || req.user.role === "2") console.log("hi");
    return res.status(200).json({ isAuthenticated: true, user: req.user });
  } else {
    console.log("heyyy");
    return res.status(200).json({ isAuthenticated: false });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User With This Email Does not Exist" });
    }

    const reset_token = crypto.randomBytes(32).toString("hex");
    const hashed_token = crypto
      .createHash("sha256")
      .update(reset_token)
      .digest("hex"); // Hashed token
    const reset_token_expires = new Date(Date.now() + 3600000);

    console.log("date", reset_token_expires);

    user.resetpasswordtoken = hashed_token;
    user.resetpasswordexpires = reset_token_expires;
    await user.save();

    const resetLink = `http://localhost:3100/reset-password?token=${reset_token}`;

    // Send a confirmation email with the link
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        // Do not fail on invalid certs
        rejectUnauthorized: false,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      html: `
      <p>Dear User,</p>
      <p>You requested a password reset. Please click the link below to reset your password:</p>
      <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Click here to reset your password</a>
      <p>If you did not request this, please ignore this email.</p>
      <p>Regards,<br>Your Team</p>
    `,
    });
    res
      .status(200)
      .json({ message: "Password reset link sent. Check your email." });
  } catch (error) {
    console.log("error ", error.message);
    res
      .status(500)
      .json({ message: "Error in password reset", error: error.message });
  }
};

// Verify the token (GET)
exports.verifyToken = async (req, res) => {
  try {
    const { token } = req.query;
    const hashed_token = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex"); // Hashed token
    const user = await User.findOne({
      where: {
        resetpasswordtoken: hashed_token,
        resetpasswordexpires: { [Op.gt]: new Date() }, // Ensure token hasn't expired
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    res.status(200).json({ message: "Token is valid." });
  } catch (error) {
    console.log("error ", error.message);
    res
      .status(500)
      .json({ message: "Error verifying token.", error: error.message });
  }
};

// Reset the password (POST)
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const hashed_token = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex"); // Hashed token
    const user = await User.findOne({
      where: {
        resetpasswordtoken: hashed_token,
        resetpasswordexpires: { [Op.gt]: new Date() }, // Ensure token hasn't expired
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    // Update the user's password
    user.password = newPassword; // The `beforeUpdate` hook will handle hashing

    // Clear reset token fields
    user.resetpasswordtoken = null;
    user.resetpasswordexpires = null;

    await user.save();

    res.status(200).json({ message: "Password has been successfully reset." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error resetting password.", error: error.message });
  }
};

exports.getallusers = async (req, res) => {
  try {
    const users = await User.findAll();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
