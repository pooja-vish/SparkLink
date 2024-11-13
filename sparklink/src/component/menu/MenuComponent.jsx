import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './MenuComponent.css';
import Collapse from 'react-bootstrap/Collapse';
import sparklink_logo from '../../assets/SparkLink_Logo.png';
import sparklink_icon from '../../assets/SparkLink_icon.png';
import view_icon from '../../assets/view_project.png';
import about_icon from '../../assets/about_us.png';
import contact_icon from '../../assets/contact_us.png';
import milestone_icon from '../../assets/Milestone_Tracker.png';
import profile_icon from '../../assets/profile.png';
import create_icon from '../../assets/create_project.png';
import axios from "axios";
import LoginComponent from '../login/LoginComponent'
import { useNavigate } from "react-router-dom";
import logout_icon from '../../assets/logout.png';
import { useAuth } from '../../AuthContext';


const MenuComponent = () => {
     const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState(false); // MouseEvent
    const [role, setRole] = useState(''); // UserRole
    const { isAuthenticated, setIsAuthenticated } = useAuth()
    const getNavItemClass = (path) => {
        return location.pathname === path ? 'nav-item active' : 'nav-item';
    };

    const logout = async (req,res) => {
        
        const response= await axios.post("/api/users/logout");
        if (response.status === 401){
            window.alert("User is logged out");
            console.log("hiiiiii")
        }
        else{
        console.log(response.data);
        setIsAuthenticated(false);
        navigate('/');
        }

    }

    return (
        <>
            <div className="container-fluid">
                <div className="sidemenu-container">
                    <div onMouseEnter={() => setOpen(true)}
                        onMouseLeave={() => setOpen(false)}>
                        <nav className={`navbar content ${open ? 'navBackground_expanded' : 'navBackground'}`}
                            style={{ position: 'absolute' }}>
                            {open ? (
                                <Collapse in={open}>
                                    <div className='navBackground_expanded text-center'>
                                        <br />
                                        <div className="logo text-center">
                                            <Link className='text-menu' to='/'>
                                                <img src={sparklink_icon}
                                                    className='nav_menu_icon' alt=''></img>
                                                <img src={sparklink_logo} alt="Logo" className="sparklink_logo" style={{ marginLeft: 15 }} /></Link>
                                        </div>
                                        <ul className="nav navbar-nav mt-5">
                                            <div className="text-menu-category text-start px-3">Home</div>
                                            <li className={getNavItemClass('/profile')}>
                                                <span style={{ cursor: 'pointer' }}>
                                                    <Link className='text-menu' to='/profile'>
                                                        <img src={profile_icon}
                                                            className='nav_sub_menu_icon' alt='' style={{ marginLeft: 15 }}></img>
                                                        &nbsp;&nbsp;&nbsp;User Profile</Link>
                                                </span>
                                            </li>
                                            {role === '' && (<li className={getNavItemClass('/about')}>
                                                <span style={{ cursor: 'pointer' }}>
                                                    <Link className='text-menu' to='/about'>
                                                        <img src={about_icon}
                                                            className='nav_sub_menu_icon' alt='' style={{ marginLeft: 15 }}></img>
                                                        &nbsp;&nbsp;&nbsp;About Us</Link>
                                                </span>
                                            </li>)}
                                            {role === '' && (<li className={getNavItemClass('/contact')}>
                                                <span style={{ cursor: 'pointer' }}>
                                                    <Link style={{
                                                        fontFamily: '"Poppins", sans-serif', fontWeight: 500,
                                                        color: '#E6E6E6', fontStyle: 'normal'
                                                    }} to='/contact'>
                                                        <img src={contact_icon}
                                                            className='nav_sub_menu_icon' alt='' style={{ marginLeft: 15 }}></img>
                                                        &nbsp;&nbsp;&nbsp;Contact Us</Link>
                                                </span>
                                            </li>)}
                                        </ul>
                                        <ul className="nav navbar-nav mt-3">
                                            <div className="text-menu-category text-start px-3">Project</div>
                                            <li className={getNavItemClass('/create-project')}>
                                                <span style={{ cursor: 'pointer' }}>
                                                    <Link className='text-menu' to='/create-project'>
                                                        <img src={create_icon}
                                                            className='nav_sub_menu_icon' alt='' style={{ marginLeft: 15 }}></img>
                                                        &nbsp;&nbsp;&nbsp;Create Project</Link>
                                                </span>
                                            </li>
                                            {role === '' && (<li className={getNavItemClass('/view-project')}>
                                                <span style={{ cursor: 'pointer' }}>
                                                    <Link className='text-menu' to='/view-project'>
                                                        <img src={view_icon}
                                                            className='nav_sub_menu_icon' alt='' style={{ marginLeft: 15 }}></img>
                                                        &nbsp;&nbsp;&nbsp;View Project</Link>
                                                </span>
                                            </li>)}
                                            {role === '' && (<li className={getNavItemClass('/progress')}>
                                                <span style={{ cursor: 'pointer' }}>
                                                    <Link style={{
                                                        fontFamily: '"Poppins", sans-serif', fontWeight: 500,
                                                        color: '#E6E6E6', fontStyle: 'normal'
                                                    }} to='/progress'>
                                                        <img src={milestone_icon}
                                                            className='nav_sub_menu_icon' alt='' style={{ marginLeft: 15 }}></img>
                                                        &nbsp;&nbsp;&nbsp;Milestone Tracker</Link>
                                                </span>
                                            </li>)}

                                            {role === '' && (<li className={getNavItemClass('/login')}>
                                                <span style={{ cursor: 'pointer' }}>
                                                    <Link style={{
                                                        fontFamily: '"Poppins", sans-serif', fontWeight: 500,
                                                        color: '#E6E6E6', fontStyle: 'normal'
                                                    }} to='/login'>
                                                        <img src={milestone_icon}
                                                            className='nav_sub_menu_icon' alt='' style={{ marginLeft: 15 }}></img>
                                                        &nbsp;&nbsp;&nbsp;Login</Link>
                                                </span>
                                            </li>)}


                                            <li className={getNavItemClass('/logout')}>
                                                <span style={{ cursor: 'pointer' }}>

                                                    <span className='text-menu' onClick={logout} style={{ marginLeft: 15, marginBottom: 15, position: 'absolute', bottom: 0 }}>
                                                        <img src={logout_icon}
                                                            className='nav_sub_menu_icon' alt=''></img>
                                                        &nbsp;&nbsp;&nbsp;Logout</span>
                                                </span>
                                            </li>

                                        </ul>
                                    </div>
                                </Collapse>
                            ) : (
                                <Collapse in={!open}>
                                    <div className='navBackground'>
                                        <br />
                                        <div className="logo text-center">
                                            <img src={sparklink_icon}
                                                className='nav_collapsed_menu_icon' alt=''></img>
                                        </div>
                                        <ul className="nav navbar-nav mt-5">
                                            <li className="nav-item">
                                                <span style={{ cursor: 'pointer' }}>
                                                    <img src={profile_icon}
                                                        className='nav_sub_menu_icon' alt='' style={{ marginLeft: 15 }}></img>
                                                </span>
                                            </li>
                                            <li className="nav-item">
                                                <span style={{ cursor: 'pointer' }}>
                                                    <img src={about_icon}
                                                        className='nav_sub_menu_icon' alt='' style={{ marginLeft: 15 }}></img>
                                                </span>
                                            </li>
                                            {role === '' && (<li className="nav-item">
                                                <span style={{ cursor: 'pointer' }}>
                                                    <img src={contact_icon}
                                                        className='nav_sub_menu_icon' alt='' style={{ marginLeft: 15 }}></img>
                                                </span>
                                            </li>)}
                                        </ul>

                                        <ul className="nav navbar-nav">
                                            <li className="nav-item">
                                                <span style={{ cursor: 'pointer' }}>
                                                    <img src={create_icon}
                                                        className='nav_sub_menu_icon' alt='' style={{ marginLeft: 15 }}></img>
                                                </span>
                                            </li>
                                            <li className="nav-item">
                                                <span style={{ cursor: 'pointer' }}>
                                                    <img src={view_icon}
                                                        className='nav_sub_menu_icon' alt='' style={{ marginLeft: 15 }}></img>
                                                </span>
                                            </li>
                                            {role === '' && (<li className="nav-item">
                                                <span style={{ cursor: 'pointer' }}>
                                                    <img src={milestone_icon}
                                                        className='nav_sub_menu_icon' alt='' style={{ marginLeft: 15 }}></img>
                                                </span>
                                            </li>)}

                                            <li className="nav-item">
                                                <span style={{ cursor: 'pointer' }}>
                                                    <img src={logout_icon}
                                                        className='nav_sub_menu_icon' alt='' style={{ marginLeft: 15, marginBottom: 15, position: 'absolute', bottom: 0 }}></img>
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </Collapse>
                            )}
                        </nav>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MenuComponent;