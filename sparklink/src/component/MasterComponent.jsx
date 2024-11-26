import React from 'react';
import './MasterComponent.css';
import sparklink_logo from '../assets/SparkLink_Logo_3.png';
import { useAuth } from '../AuthContext';
import Swal from 'sweetalert2';
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";

const MasterComponent = () => {
    const { isAuthenticated, setIsAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const logout = async (req, res) => {
        const response = await axios.post("/api/users/logout");
        if (response.status === 200) {
            setIsAuthenticated(false);
            navigate('/');
            Swal.fire('Success', response.message, 'success');
        } else {
            Swal.fire('Error', response.message, 'error');
        }
    }

    const getNavItemClass = (path) => {
        return location.pathname === path ? 'nav-item active' : 'nav-item';
    };
    return (
        <>
            <div className="container-fluid">
                <div className="ms-lg-5 ms-md-0 mt-2 row" style={{ paddingRight: 25 }}>
                    <div className="col-lg-5 col-md-5 px-5 col-sm-12 heading">
                        <Link to='/'>
                            <img src={sparklink_logo} alt="Logo" className="sparklink_logo" />
                        </Link>
                    </div>
                    <div className="col-lg-7 col-md-7 col-sm-12">
                        {!isAuthenticated && (<span className='d-flex align-items-center justify-content-end'>
                            <span className='heading'>Sign in to Collborate Better!</span>&nbsp;&nbsp;
                            <Link className={getNavItemClass('/login')} to='/login'>
                                <button className={`text-center button_text button-card`}>
                                    Login</button></Link>
                        </span>)}
                        {isAuthenticated && (<span className='d-flex align-items-center justify-content-end'>
                            <span className='heading'>Welcome {user.username}!</span>&nbsp;&nbsp;
                            <button onClick={logout} className="text-center button_text button-card">Logout</button>
                        </span>)}
                    </div>
                </div>
            </div>
        </>
    );
};

export default MasterComponent;