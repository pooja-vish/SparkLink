import React from 'react';
import { useRoutes } from 'react-router-dom';
import MasterComponent from './component/MasterComponent';
import HomeComponent from './component/home/HomeComponent';
import AboutComponent from './component/about/AboutComponent';
import ContactComponent from './component/contact/ContactComponent';

const AppRoutes = () => {
    let routes = useRoutes([
        // { path: '/', element: <MasterComponent /> },
        { path: '/', element: <HomeComponent /> },
        { path: '/about', element: <AboutComponent /> },
        { path: '/contact', element: <ContactComponent /> }
    ]);

    return routes;
}

export default AppRoutes;