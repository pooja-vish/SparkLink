import React, { useEffect, useState } from "react";
import { useRoutes } from "react-router-dom";
import HomeComponent from "./component/home/HomeComponent";
import AboutComponent from "./component/about/AboutComponent";
import ContactComponent from "./component/contact/ContactComponent";
import ProgressTrackerComponent from "./component/progress-tracker/ProgressTrackerComponent";
import CreateProjectComponent from "./component/createproject/CreateProjectComponent";

import LoginComponent from "./component/login/LoginComponent";
import ProtectedRoute from "./component/ProtectedRoute";
import ProjApplicationComponent from "./component/project-applications/projApplicationComponent";
import ViewProjectComponent from "./component/viewproject/ViewProjectComponent";

const AppRoutes = () => {
  let routes = useRoutes([
    { path: "/", element: <HomeComponent /> },
    { path: "/about", element: <AboutComponent /> },
    { path: "/contact", element: <ContactComponent /> },

    {
      path: "/progress",
      element: (
        <ProtectedRoute>
          <ProgressTrackerComponent />
        </ProtectedRoute>
      ),
    },
    {
      path: "/create-project",
      element: (
        <ProtectedRoute>
          <CreateProjectComponent />
        </ProtectedRoute>
      ),
    },
    { path: "/login", element: <LoginComponent /> },

    {
      path: "/view-project",
      element: (
        <ProtectedRoute>
          <ViewProjectComponent />
        </ProtectedRoute>
      ),
    },
    {
      path: "/projApplications",
      element: (
        <ProtectedRoute>
          <ProjApplicationComponent />
        </ProtectedRoute>
      ),
    },
  ]);

  return routes;
};

export default AppRoutes;
