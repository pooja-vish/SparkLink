import React from 'react';
import { useRoutes } from 'react-router-dom';
import HomeComponent from './component/home/HomeComponent';
import AboutComponent from './component/about/AboutComponent';
import ContactComponent from './component/contact/ContactComponent';
import ProgressTrackerComponent from './component/progress-tracker/ProgressTrackerComponent';
import CreateProjectComponent from './component/createproject/CreateProjectComponent';


const AppRoutes = () => {
    let routes = useRoutes([
        // { path: '/', element: <MasterComponent /> },
        { path: '/', element: <HomeComponent /> },
        { path: '/about', element: <AboutComponent /> },
        { path: '/contact', element: <ContactComponent /> },
        { path: '/progress', element: <ProgressTrackerComponent /> },
        { path: '/create-project', element: <CreateProjectComponent /> }
    ]);

    return routes;
}

export default AppRoutes;