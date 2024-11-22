import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditProfileComponent.css';
import MenuComponent from '../menu/MenuComponent';
import { useAuth } from '../../AuthContext';

const EditProfileComponent = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // Fetch Profile Data
    const fetchProfile = async () => {
        if (!user) return;
        try {
            const response = await axios.get('/editProfile');
            setProfile(response.data.profile);
        } catch (err) {
            setError('Error fetching profile.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [user]);

    // Handle Input Changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    };

    // Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/editProfile', profile);
            navigate('/profile');
            // console("post update response = ", response);
            // setMessage(response.data.message || 'Profile updated successfully FE!');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to update profile FE.');
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <>
            <MenuComponent />
            <div className="container bootstrap snippets bootdeys">
                <div className="row">
                    <div className="col-xs-12 col-sm-9">
                        <form className="form-horizontal" onSubmit={handleSubmit}>
                            {/* Avatar */}
                            <div className="panel panel-default">
                                <div className="panel-body text-center">
                                    <img
                                        src="https://bootdey.com/img/Content/avatar/avatar7.png"
                                        className="img-circle profile-avatar"
                                        alt="User avatar"
                                    />
                                </div>
                            </div>

                            {/* User Info */}
                            <div className="panel panel-default">
                                <div className="panel-heading">
                                    <h4 className="panel-title text-orange">User Info</h4>
                                </div>
                                <div className="panel-body">
                                    {/* Fields */}
                                    {[
                                        { label: 'Bio', name: 'bio', type: 'textarea' },
                                        { label: 'Education', name: 'education', type: 'text' },
                                        { label: 'Experience', name: 'experience', type: 'text' },
                                        { label: 'Courses', name: 'course', type: 'text' },
                                        { label: 'Skills', name: 'skills', type: 'text' },
                                    ].map(({ label, name, type }) => (
                                        <div className="form-group" key={name}>
                                            <label className="col-sm-2 control-label">{label}</label>
                                            <div className="col-sm-10">
                                                {type === 'textarea' ? (
                                                    <textarea
                                                        name={name}
                                                        value={profile[name] || ''}
                                                        className="form-control"
                                                        onChange={handleChange}
                                                        placeholder={`Enter ${label.toLowerCase()}`}
                                                    />
                                                ) : (
                                                    <input
                                                        name={name}
                                                        type={type}
                                                        value={profile[name] || ''}
                                                        className="form-control"
                                                        onChange={handleChange}
                                                        placeholder={`Enter ${label.toLowerCase()}`}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="panel panel-default">
                                <div className="panel-heading">
                                    <h4 className="panel-title text-orange">Contact Info</h4>
                                </div>
                                <div className="panel-body">
                                    {[
                                        { label: 'Phone Number', name: 'phone_number', type: 'tel' },
                                        { label: 'E-mail Address', name: 'email', type: 'email' },
                                        { label: 'LinkedIn', name: 'linkedin', type: 'text' },
                                        { label: 'GitHub', name: 'github', type: 'text' },
                                        { label: 'Address', name: 'address', type: 'text' },
                                    ].map(({ label, name, type }) => (
                                        <div className="form-group" key={name}>
                                            <label className="col-sm-2 control-label">{label}</label>
                                            <div className="col-sm-10">
                                                <input
                                                    name={name}
                                                    type={type}
                                                    value={profile[name] || ''}
                                                    className="form-control"
                                                    onChange={handleChange}
                                                    placeholder={`Enter ${label.toLowerCase()}`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Submit and Cancel */}
                            <div className="form-group">
                                <div className="col-sm-10 col-sm-offset-2">
                                    <button type="submit" className="btn btn-primary">Submit</button>
                                    <a href="/Profile" className="btn btn-secondary">Cancel</a>
                                </div>
                            </div>

                            {/* Message */}
                            {message && <div className="alert alert-success">{message}</div>}
                            {error && <div className="alert alert-danger">{error}</div>}
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditProfileComponent;