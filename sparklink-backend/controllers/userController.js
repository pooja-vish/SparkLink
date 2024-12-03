require("dotenv").config();
const User = require("../models/user");
const SupervisorProfile = require("../models/supervisor_profile");
const BusinessOwner = require("../models/owner_profile");
const StudentProfile = require("../models/student_profile");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const passport = require("../config/passportConfig");
const { Op } = require("sequelize");
const { getTop5RecommendedProjects } = require("../queue/skillextraction");
const  sequelize  = require("../config/db");

// Register a new user with role

exports.register = async (req, res) => {
  try {
    const { username, email, password, confirmPassword, name, role } = req.body;

    if( password !== confirmPassword){
      return res.status(400).json({message: "Passwords do not match!"});
    }
    if ((role === '3' || role === '4') && !email.endsWith("@uwindsor.ca")) {
      return res.status(400).json({ message: "Email should end with @uwindsor.ca" });
    }

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
      role: role,
      modified_by: role,
      created_by: role,
      confirmation_token: confirmationToken, // Save the token to the database
    });
    console.log(" entered");
    if (role === '3') {
      await SupervisorProfile.create({
        user_id: newUser.user_id,
        is_verified: false,
        is_project_owner: false,
      });
    } else if (role === '2') {
      await BusinessOwner.create({
        user_id: newUser.user_id,
      });
    } else if (role === '4') {
      console.log(" user is student ");
      await StudentProfile.create({
        user_id: newUser.user_id,
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
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #4CAF50;">Welcome to Our Platform!</h2>
          <p>Thank you for signing up. Please confirm your email address by clicking the button below:</p>
          <a 
            href="${confirmationLink}" 
            style="display: inline-block; padding: 10px 20px; margin: 10px 0; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">
            Confirm Email
          </a>
          <p>If the button above doesn't work, copy and paste the following link into your browser:</p>
          <p style="word-break: break-word;">${confirmationLink}</p>
          <hr style="border: none; border-top: 1px solid #ccc;">
          <p style="font-size: 0.9em; color: #666;">
            If you didn’t create an account, please ignore this email.
          </p>
        </div>
      `,
    });

    res.status(201).json({
      message:
        "User registered successfully. Please check your email to confirm your account.",
    });
  } catch (error) {
    console.log(error.message);
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
    const { username, email, role, user_id} = req.user; // Assuming req.user contains these fields
    return res.status(200).json({
      isAuthenticated: true,
      user: { username, email, role , user_id},
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

exports.updateuser = async (req, res) => {
  try {
    const { id } = req.params; // User ID from the route
    const { username, email, name, role, is_active, modified_by } = req.body; // Data from request

    // Find the user by ID and update
    const [updated] = await User.update(
      {
        username,
        email,
        name,
        role,
        is_active,
        modified_by: req.user.user_id,
        // Optional: Track who modified
      },
      { where: { user_id: id }, returning: true }
    );

    if (updated === 0) {
      return res
        .status(404)
        .json({ message: "User not found or no changes made." });
    }

    // Return the updated user
    const updatedUser = await User.findByPk(id);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params; // User ID from the route

    // Find the user by ID
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Mark the user as inactive or delete them
    await User.update({ is_active: "N" }, { where: { user_id: id } });

    res.status(200).json({ message: "User successfully deleted (marked inactive)." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
};

exports.get5recommendedProjects = async (req, res) => {
  try {
    const user = req.user; // Get the whole user object from req.user
    console.log("user skills");

    // Fetching the student profile based on user_id
    const studentProfile = await StudentProfile.findOne({
      where: { user_id: user.user_id }, // Querying by user_id (from req.user)
      attributes: ['skills'], // Only fetch the specified fields
    });

    if (!studentProfile) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    // Split and trim the skills list
    const skillsList = studentProfile.skills
      ? studentProfile.skills
          .split(',')
          .map(skill => skill.trim())  // Remove any surrounding spaces
          .filter(skill => skill.length > 0)  // Remove any empty strings
      : [];

    // Fetch projects associated with the user
    const projectsWithSkills = await sequelize.query(
      `
      SELECT DISTINCT tp.skills_req
      FROM t_proj_allocation tup
      JOIN t_project tp ON tup.proj_id = tp.proj_id
      WHERE tup.user_id = :userId
      AND tup.is_active = 'Y'
      `,
      {
        replacements: { userId: user.user_id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // Extract and combine skills from the fetched projects
    const projectSkills = projectsWithSkills
      .map(project => project.skills_req)  // Get the required skills field
      .filter(skills => skills)  // Make sure skills_req exists
      .map(skills => skills.split(','))
      .flat()
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);

    console.log(projectSkills);

    const allSkills = [...new Set([...skillsList, ...projectSkills])];
    console.log('Merged Skills List:', allSkills);
    // Fetch all projects with required skills
    const projectsWithSkillsa = await sequelize.query(
      `
      SELECT proj_id, skills_req
FROM t_project tp
WHERE skills_req IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM t_proj_allocation tpa
    WHERE tpa.proj_id = tp.proj_id
    AND tpa.user_id = :userId -- Exclude projects where the user is already allocated
)
      `,
      { replacements: { userId: user.user_id },
        type: sequelize.QueryTypes.SELECT }
    );

    const recommendedProjects = [];

    for (const project of projectsWithSkillsa) {
      const { proj_id, skills_req } = project;

      // Check if skills_req is valid
      if (skills_req) {
        // Split and trim the project's required skills
        const projectSkills = skills_req
          .split(',')
          .map(skill => skill.trim())
          .filter(skill => skill.length > 0);

        // Find the intersection of user skills and project skills
        const commonSkills = allSkills.filter(skill => projectSkills.includes(skill));

        // Calculate the match percentage
        const matchPercentage = (commonSkills.length / projectSkills.length) * 100;

        // If matchPercentage is more than 60%, add to recommended list
        if (matchPercentage > 40) {
          recommendedProjects.push({
            proj_id,
            matchPercentage,
            commonSkills,
          });
        }
      } else {
        console.log(`Project ${proj_id} has no required skills.`);
      }
    }

    // Sort projects by match percentage in descending order
    recommendedProjects.sort((a, b) => b.matchPercentage - a.matchPercentage);

    // Limit to top 5 recommended projects
    const top5Projects = recommendedProjects.slice(0, 5);

    console.log(top5Projects)
    const recommendedProjectIds = top5Projects.map(project => project.proj_id); // Extracting the proj_id of the top 5 recommended projects

    const projectsQuery = `
  SELECT pr.*, ps.status_desc
  FROM t_project pr
  JOIN t_proj_status ps ON pr.status = ps.status_id
  WHERE pr.is_active = 'Y'
  AND pr.proj_id IN (:recommendedProjectIds)  
  ORDER BY pr.created_on DESC
  LIMIT 50;
`;
const projects = await sequelize.query(projectsQuery, {
  replacements: { recommendedProjectIds: recommendedProjectIds },
  type: sequelize.QueryTypes.SELECT,
});

if (projects && projects.length > 0) {
  const projIds = projects.map(project => project.proj_id);

  const stakeholdersQuery = `
    SELECT pa.proj_id, u.username || ' ' || u.name as name, u.user_id,
    CASE 
      WHEN pa.role = 2 THEN 'business_owner'
      WHEN pa.role = 3 THEN 'supervisor'
      WHEN pa.role = 4 THEN 'student'
    END AS role
    FROM t_proj_allocation pa, t_usermst u 
    WHERE pa.user_id = u.user_id
    and pa.is_active = 'Y'
    and pa.proj_id IN (:projIds)
    order by proj_id desc;
  `;
  const stakeholders = await sequelize.query(stakeholdersQuery, {
    replacements: { projIds },
    type: sequelize.QueryTypes.SELECT,
  });

  const stakeholderMap = stakeholders.reduce((map, stakeholder) => {
    if (!map[stakeholder.proj_id]) {
      map[stakeholder.proj_id] = [];
    }
    map[stakeholder.proj_id].push({
      name: stakeholder.name,
      role: stakeholder.role,
      user_id: stakeholder.user_id,
      proj_id: stakeholder.proj_id
    });
    return map;
  }, {});

  const milestonesQuery = `
    SELECT proj_id, 
      COUNT(CASE WHEN is_active = 'Y' THEN 1 END) AS active_milestones,
      COUNT(CASE WHEN is_active = 'Y' AND is_completed = 'Y' THEN 1 END) AS completed_milestones
    FROM t_proj_milestone
    WHERE proj_id IN (:projIds)
    GROUP BY proj_id;
  `;
  const milestones = await sequelize.query(milestonesQuery, {
    replacements: { projIds },
    type: sequelize.QueryTypes.SELECT,
  });

  // Map milestones by project
  const milestoneMap = milestones.reduce((map, milestone) => {
    const progress = milestone.active_milestones > 0
      ? Math.round((milestone.completed_milestones / milestone.active_milestones) * 100)
      : 0;
    map[milestone.proj_id] = progress || 0;
    return map;
  }, {});

  // Combine all data into the projects array
  projects.forEach(project => {
    project.status_desc = project.status_desc || '';
    project.stakeholder = stakeholderMap[project.proj_id] || [];
    project.progress = milestoneMap[project.proj_id] || 0;
  });
}

res.status(200).json({
  projects,
  user: {
    user_id: user.user_id,
    username: user.username,
    email: user.email,
    role: user.role,
    isAuthenticated: true,
  },
});

    // Respond with the projects whose match percentage is more than 60%
    
    // Handle case where no projects with required skills were found
    

   
    

  } catch (error) {
    console.error('Error fetching recommended projects:', error);
    return res.status(500).json({ message: 'Error fetching recommended projects' });
  }
};
