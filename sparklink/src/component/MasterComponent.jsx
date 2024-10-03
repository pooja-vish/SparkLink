import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './MasterComponent.css';
import sparklink_logo from '../assets/SparkLink_Logo.png';

const MasterComponent = () => {
    const location = useLocation();

    const getNavItemClass = (path) => {
        return location.pathname === path ? 'nav-item active' : 'nav-item';
    };

    return (
        <>
            <div className="container-fluid">
                <div className="ms-lg-5 ms-md-0 py-3 row">
                    <div className="col-lg-9 col-md-6 col-sm-12 heading">
                        <img src={sparklink_logo} alt="Logo" className="sparklink_logo" />
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-12 mt-2 nav-text d-flex">
                        <span className="px-3">
                            <Link className={getNavItemClass('/')} to="/">Home</Link>
                        </span>
                        <span className="px-3">
                            <Link className={getNavItemClass('/about')} to="/about">About</Link>
                        </span>
                        <span className="px-3">
                            <Link className={getNavItemClass('/contact')} to="/contact">Contact</Link>
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MasterComponent;