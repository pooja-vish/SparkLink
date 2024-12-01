const ProjApplication = require("../models/proj_application");
const ProjAllocation = require("../models/proj_allocation");
const User = require("../models/user");
const Project = require("../models/project");

exports.fetchNotifications = async (req, res) => {
  console.log("entered fetch applciation");
  try {
    const user = req.user;

    let notifications = [];
    console.log(" role---> ", user.role);
    if (user.role === "2") {
      // Business Owner
      console.log("entered if condition");
      console.log("Associations ---> ", ProjAllocation.associations);
      console.log("Associations ---> ", ProjApplication.associations);
      const allocations = await Project.findAll({
        where: {
          user_id: user.user_id,
          is_active: "Y",
        },
        attributes: ["proj_id"], // Get only the proj_id
      }).then(async (projects) => {
        // Extract proj_ids from the fetched projects
        const projIds = projects.map((project) => project.proj_id);

        // Now, search in the ProjAllocation table for matching proj_ids
        const allocations = await ProjAllocation.findAll({
          where: {
            proj_id: projIds,
            b_notification: "Y",
            is_active: "Y",
          },
          include: [
            {
              model: User,
              attributes: ["user_id", "username"],
              as: "user",
            },
            {
              model: Project,
              attributes: ["proj_id", "project_name"],
              as: "project",
            },
          ],
        });
        return allocations;
      });

      // console.log('allocations --- > ', allocations);

      allocations.forEach((allocation) => {
        const { proj_id, role, created_on } = allocation;
        const project_name = allocation.project.project_name;
        const user_id = allocation.user.user_id;
        const user_name = allocation.user.username;

        console.log("role ---> ", role);

        if (role === 2) {
          console.log("entered  role ==2 ");
          notifications.push({
            code: "BP",
            user_id,
            user_name,
            proj_id,
            proj_name: project_name,
            created_on,
          });
        }

        if (role === 3) {
          notifications.push({
            code: "BS",
            user_id,
            user_name,
            proj_id,
            proj_name: project_name,
            created_on,
          });
        }

        if (role === 4) {
          notifications.push({
            code: "BT",
            user_id,
            user_name,
            proj_id,
            proj_name: project_name,
            created_on,
          });
        }
      });
    } else if (user.role === "3") {
      const allocation_projIds = await ProjAllocation.findAll({
        where: {
          user_id: user.user_id,
          is_active: "Y",
        },
        attributes: ["proj_id"], // Get proj_id's
      });

      const projIds = allocation_projIds.map(
        (allocation) => allocation.proj_id
      );

      allocations = await ProjAllocation.findAll({
        where: {
          proj_id: projIds,
          s_notification: "Y",
          is_active: "Y",
        },
        include: [
          {
            model: User,
            attributes: ["user_id", "username"],
            as: "user",
          },
          {
            model: Project,
            attributes: ["proj_id", "project_name"],
            as: "project",
          },
        ],
      });

      allocations.forEach((allocation) => {
        const { proj_id, role, created_on } = allocation;
        const project_name = allocation.project.project_name;
        const user_id = allocation.user.user_id;
        const user_name = allocation.user.username;

        if (role === 2 && user_id === user.user_id) {
          // Insert SP notification for role 2 (Business)
          notifications.push({
            code: "SP",
            user_id,
            user_name,
            proj_id,
            proj_name: project_name,
            created_on,
          });
        } else if (role === 3 && user_id === user.user_id) {
          // Insert SV notification for role 3 (Supervisor)
          notifications.push({
            code: "SV",
            user_id,
            user_name,
            proj_id,
            proj_name: project_name,
            created_on,
          });
        } else if (role === 3 && user_id !== user.user_id) {
          // Insert SS notification for role 3 (Supervisor different user)
          notifications.push({
            code: "SS",
            user_id,
            user_name,
            proj_id,
            proj_name: project_name,
            created_on,
          });
        } else if (role === 4) {
          // Insert ST notification for role 4 (Student)
          notifications.push({
            code: "ST",
            user_id,
            user_name,
            proj_id,
            proj_name: project_name,
            created_on,
          });
        }
      });

      const applications = await ProjApplication.findAll({
        where: {
          proj_id: projIds,
          is_active: "Y",
          is_approved: "N",
          is_rejected: "N",
        },
        include: [
          {
            model: User,
            attributes: ["user_id", "username"],
            as: "user",
          },
          {
            model: Project,
            attributes: ["proj_id", "project_name"],
            as: "project",
          },
        ],
      });

      applications.forEach((application) => {
        const { proj_id, role, created_on } = application;
        const project_name = application.project.project_name;
        const user_id = application.user.user_id;
        const user_name = application.user.username;
        notifications.push({
          code: "SA",
          user_id,
          user_name,
          proj_id,
          proj_name: project_name,
          created_on,
        });
      });
    } else if (user.role === "4") {
      const allocations = await ProjAllocation.findAll({
        where: {
          user_id: user.user_id,
          notification: "Y",
        },
        include: [
          {
            model: User,
            attributes: ["user_id", "username"],
            as: "user",
          },
          {
            model: Project,
            attributes: ["proj_id", "project_name"],
            as: "project",
          },
        ],
      });
      allocations.forEach((allocation) => {
        const { proj_id, role, created_on, is_active } = allocation;
        const project_name = allocation.project.project_name;
        const user_id = allocation.user.user_id;
        const user_name = allocation.user.username;

        if (role === 4 && is_active === "Y") {
          // Insert SP notification for role 2 (Business)
          notifications.push({
            code: "TA",
            user_id,
            user_name,
            proj_id,
            proj_name: project_name,
            created_on,
          });
        } else if (role === 4 && is_active === "N") {
          notifications.push({
            code: "TR",
            user_id,
            user_name,
            proj_id,
            proj_name: project_name,
            created_on,
          });
        }
      });
    }

    notifications.sort((a, b) => {
      const dateA = new Date(a.created_on);
      const dateB = new Date(b.created_on);
      return dateB - dateA;
    });
    res.status(200).json({
      message: "Notifications list created successfully.",
      notifications,
    });
  } catch (error) {
    console.log("error --> ", error);
    res.status(500).json({
      message: "Error creating notifications list.",
      error: error.message,
    });
  }
};

exports.fetchNotificationCount = async (req, res) => {
  try {
    const user = req.user;

    let notifCount  = 0;

    if (user.role === "2") {
      // Business Owner
      notifCount  = await Project.findAll({
        where: {
          user_id: user.user_id,
          is_active: "Y",
        },
        attributes: ["proj_id"], // Get only the proj_id
      }).then(async (projects) => {
        // Extract proj_ids from the fetched projects
        const projIds = projects.map((project) => project.proj_id);
      
        // Fetch the count of allocations matching proj_ids
        const allocationCount = await ProjAllocation.count({
          where: {
            proj_id: projIds,
            b_notification: "Y",
            is_active: "Y",
          },
        });
        console.log("allocationCount ---> ",allocationCount);
        return allocationCount;
      });
    } else if (user.role === "3") {
      // Supervisor
      const allocation_projIds = await ProjAllocation.findAll({
        where: {
          user_id: user.user_id,
          is_active: "Y",
        },
        attributes: ["proj_id"], // Get proj_id's
      });

      const projIds = allocation_projIds.map(
        (allocation) => allocation.proj_id
      );

      allocations = await ProjAllocation.findAll({
        where: {
          proj_id: projIds,
          s_notification: "Y",
          is_active: "Y",
        },
        include: [
          {
            model: User,
            attributes: ["user_id", "username"],
            as: "user",
          },
          {
            model: Project,
            attributes: ["proj_id", "project_name"],
            as: "project",
          },
        ],
      });

      allocations.forEach((allocation) => {
        const {  role} = allocation;
        const user_id = allocation.user.user_id;
        if (role === 2 && user_id !== user.user_id){
            return;
        } else{
            notifCount++;
        }

      });
      

      console.log("Before notifCount ---> ",notifCount);
      notifCount += await ProjApplication.count({
        where: {
          proj_id: projIds,
          is_active: "Y",
          is_approved: "N",
          is_rejected: "N",
        },
      });

      console.log("After notifCount ---> ",notifCount);

    } else if (user.role === "4") {
      // Student
      notifCount = await ProjAllocation.count({
        where: {
          user_id: user.user_id,
          notification: "Y",
        },
      });
    }
    console.log("notifCount ---> ",notifCount);
    res.status(200).json({
      message: "Notification count fetched successfully.",
      notifCount,
    });
  } catch (error) {
    console.error("Error fetching notification count:", error);
    res.status(500).json({
      message: "Error fetching notification count.",
      error: error.message,
    });
  }
};

exports.NotificationOkay = async (req, res) => {
  try {
    const user = req.user;
    const { proj_id, user_id, code } = req.body;

    // Define the fields to update based on the notification code
    let updateField = null;

    if (["BP", "BT"].includes(code)) {
      updateField = { b_notification: "N" };
    } else if (code === "SP") {
      updateField = { s_notification: "N" };
    } else if (["SV", "SS", "ST"].includes(code)) {
      updateField = { s_notification: "N" };
    } else if (["TA", "TR"].includes(code)) {
      updateField = { notification: "N" };
    }

    if (updateField) {
      // Update the ProjAllocation table with the relevant field
      await ProjAllocation.update(updateField, {
        where: {
          user_id,
          proj_id,
          is_active: "Y", // Ensure the record is active
          ...(code === "SP" ? { role: 2 } : {}), // Role check for SP
        },
      });

      res.status(200).json({ message: "Notification updated successfully" });
    } else {
      res.status(400).json({ message: "Invalid notification code" });
    }
  } catch (error) {
    console.error("Error updating notification:", error);
    res.status(500).json({
      message: "Error updating notification",
      error: error.message,
    });
  }
};
