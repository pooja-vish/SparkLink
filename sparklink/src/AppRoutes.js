import React from 'react';
import { useRoutes } from 'react-router-dom';
import HomeComponent from './component/home/HomeComponent';
import AboutComponent from './component/about/AboutComponent';
import ContactComponent from './component/contact/ContactComponent';
import ProgressTrackerComponent from './component/progress-tracker/ProgressTrackerComponent';
import CreateProjectComponent from './component/createproject/CreateProjectComponent';
import ViewProjectComponent from './component/viewproject/ViewProjectComponent';


const AppRoutes = () => {
    let routes = useRoutes([
        // { path: '/', element: <MasterComponent /> },
        { path: '/', element: <HomeComponent /> },
        { path: '/about', element: <AboutComponent /> },
        { path: '/contact', element: <ContactComponent /> },
        { path: '/progress', element: <ProgressTrackerComponent /> },
        { path: '/create-project', element: <CreateProjectComponent /> },
        { path: '/view-project', element: <ViewProjectComponent /> }
    ]);

    return routes;
}

export default AppRoutes;