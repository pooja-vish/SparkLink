import React, { useState } from 'react';
import './MasterComponent.css';
import sparklink_logo from '../assets/SparkLink_Logo_4.png';
import { useAuth } from '../AuthContext';
import Swal from 'sweetalert2';
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";

const MasterComponent = () => {
    const { isAuthenticated, setIsAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);

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

    const fetchUserProfile = async (user_id) => {
        setLoading(true);
        try {
            const response = await axios.get('/profile', {
                params: { user_id: user_id }
            });

            if (response.status === 200) {
                navigate(`/profile?user_id=${user_id}`);
            }
        } catch (error) {
            Swal.fire({ title: 'Error', text: error.message, icon: 'error', confirmButtonText: 'Ok' });
        } finally {
            setLoading(false);
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
                                    &nbsp;&nbsp;
                            <Link className={getNavItemClass('/register')} to='/register'>
                                <button className={`text-center button_text button-card`}>
                                    Register</button></Link>
                        </span>)}
                        {isAuthenticated && (<span className='d-flex align-items-center justify-content-end'>
                            <span className='heading' onClick={() => fetchUserProfile(user.user_id)} >Welcome {user.username}!</span>&nbsp;&nbsp;
                            <button onClick={logout} className="text-center button_text button-card">Logout</button>
                        </span>)}
                    </div>
                </div>

                {/* Loading overlay */}
                {loading && (
                    <div className="loading-overlay d-flex justify-content-center align-items-center">
                        <div className="text-center">
                            <div className="spinner-border text-light" style={{ width: "5rem", height: "5rem" }} role="status">
                            </div>
                            <div className="text-light mt-2">Processing...</div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default MasterComponent;