// const Sequelize = require("sequelize");
// const sequelize = require("../config/db");

// // Import Models
// const User = require("./user");
// const Project = require("./project");
// const ProjApplication = require("./proj_application");
// const ProjAllocation = require("./proj_allocation");
// const ProjectStatus = require("./proj_status");

// // Define Associations
// // User <-> ProjApplication
// ProjApplication.belongsTo(User, {
//   foreignKey: "user_id",
//   targetKey: "user_id",
//   as: "user",
// });
// User.hasMany(ProjApplication, {
//   foreignKey: "user_id",
//   as: "applications",
// });

// // Project <-> ProjApplication
// ProjApplication.belongsTo(Project, {
//   foreignKey: "proj_id",
//   targetKey: "proj_id",
//   as: "project",
// });
// Project.hasMany(ProjApplication, {
//   foreignKey: "proj_id",
//   as: "applications",
// });

// // User <-> ProjAllocation
// User.hasMany(ProjAllocation, {
//   foreignKey: "user_id",
//   as: "projectAllocations",
// });
// ProjAllocation.belongsTo(User, {
//   foreignKey: "user_id",
//   targetKey: "user_id",
//   as: "user",
// });

// // Project <-> ProjAllocation
// Project.hasMany(ProjAllocation, {
//   foreignKey: "proj_id",
//   as: "allocations",
// });
// ProjAllocation.belongsTo(Project, {
//   foreignKey: "proj_id",
//   targetKey: "proj_id",
//   as: "project",
// });

// // Project <-> ProjectStatus
// Project.belongsTo(ProjectStatus, {
//   foreignKey: "status",
//   targetKey: "status_id",
//   as: "statusDetail",
// });

// // Export Models and Sequelize Instance
// module.exports = {
//   sequelize,
//   User,
//   Project,
//   ProjApplication,
//   ProjAllocation,
//   ProjectStatus,
// };
