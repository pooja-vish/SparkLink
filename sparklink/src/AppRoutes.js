import React from "react";
import { useRoutes } from "react-router-dom";
import HomeComponent from "./component/home/HomeComponent";
import AboutComponent from "./component/about/AboutComponent";
import ContactComponent from "./component/contact/ContactComponent";
import ProgressTrackerComponent from "./component/progress-tracker/ProgressTrackerComponent";
import CreateProjectComponent from "./component/createproject/CreateProjectComponent";
import RegisterComponent from "./component/register/RegisterComponent";
import LoginComponent from "./component/login/LoginComponent";
import ProtectedRoute from "./component/ProtectedRoute";
import ProjApplicationComponent from "./component/project-applications/projApplicationComponent";
import ViewProjectComponent from "./component/viewproject/ViewProjectComponent";
import ViewUserComponent from "./component/admin/viewUsers";



const AppRoutes = () => {
    let routes = useRoutes([
        { path: "/", element: <HomeComponent /> },
        { path: "/about", element: <AboutComponent /> },
        { path: "/contact", element: <ContactComponent /> },
        { path: "/register", element: <RegisterComponent /> },
        { path: "/login", element: <LoginComponent /> },
        { path:"/admin/viewusers", element: <ViewUserComponent/>},
        // Protected parent route
        {
            path: "/", // Protected routes parent path
            element: <ProtectedRoute />,
            children: [
                { path: "progress", element: <ProgressTrackerComponent /> },
                { path: "create-project", element: <CreateProjectComponent /> },
                { path: "view-project", element: <ViewProjectComponent /> },
                { path: "projApplications", element: <ProjApplicationComponent /> },
            ],
        },
    ]);

    return routes;
};

export default AppRoutes;
