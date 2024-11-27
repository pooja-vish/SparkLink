import MasterComponent from '../MasterComponent';
import '../progress-tracker/ProgressTrackerComponent.css';
import MenuComponent from '../menu/MenuComponent';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfileComponent.css';
import { useAuth } from '../../AuthContext';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';

const ProfileComponent = () => {
    const { user, isAuthenticated } = useAuth();
    const [role, setRole] = useState(null);
    const [profile, setProfile] = useState(null);
    const [projects, setProjects] = useState([]);
    const [projectDetails, setProjectDetails] = useState([]);
    const [selectedProjectDetails, setSelectedProjectDetails] = useState([]);
    const [projDescList, setProjDescList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null); // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
    const [isScrollable, setIsScrollable] = useState(false);

    const fetchProfile = async (user_id) => {
        //const user_id = user.user_id;
        console.log("PROF>>>>>", user_id);
        if (user) {
            try {
                const response = await axios.get("/profile", {
                    params: { user_id: user_id }
                });
                console.log('profile data = ', response.data);
                setRole(response.data.role);
                setProfile(response.data.profile);
                setProjects(response.data.projects);
                setProjectDetails(response.data.project_details);
                console.log("Is Array:", Array.isArray(projectDetails));
                setLoading(false);
            } catch (err) {
                setError('Error fetching profile FE');
                setLoading(false);
            }
        } else {
            console.log('no user', user);
        }
    };

    const openModal = (project) => {
        console.log('==project==', project);
        setSelectedProject(project);
        const project_Desc = projectDetails.find(p => p.proj_id === project.proj_id);
        setSelectedProjectDetails(project_Desc);
        console.log("selected project desc 1= >", selectedProjectDetails);
        console.log("selected project desc 2= >", selectedProjectDetails.proj_desc);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedProject(null);
        setIsModalOpen(false);
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchProfile(user.user_id);
        }
    }, [user]);

    useEffect(() => {
        console.log("projects count : ", projects.length);
        setIsScrollable(projects.length > 3);
    }, [projects]);

    useEffect(() => {
        console.log("selectedProjectDetails =1", selectedProjectDetails);
        if (selectedProject && selectedProjectDetails) {
            console.log('split wala =>', selectedProjectDetails.proj_desc);
            let splitDesc = selectedProjectDetails.proj_desc.split(";");
            console.log("splitDesc=>", splitDesc);
            let filterDesc = [];
            for (let i = 0; i < splitDesc.length; i++) {
                filterDesc[i] = splitDesc[i].trim().split(":");
            }
            setProjDescList(filterDesc);
        }
    }, [selectedProjectDetails]);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <>
            <MenuComponent />
            {role === 'student' && (
                <div className="container">
                    <div className="team-single">
                        <div className="row">
                            <div className="col-lg-4 col-md-5 xs-margin-30px-bottom">
                                <div className="team-single-img">
                                    <img
                                        className="image"
                                        src="https://bootdey.com/img/Content/avatar/avatar7.png"
                                        alt=""
                                    />
                                </div>
                                <div className="bg-light-gray padding-30px-all md-padding-25px-all sm-padding-20px-all text-center">
                                    {/* <h4 className="margin-10px-bottom font-size24 md-font-size22 sm-font-size20 font-weight-600">
                                        Full Stack Developer
                                    </h4> */}
                                    <p className="sm-width-95 sm-margin-auto">SKills : {profile.skills}</p>
                                    <div className="margin-20px-top team-single-icons">
                                        <ul className="no-margin">
                                            <li>
                                                <a href={profile.linkedin}>
                                                    <i className="fab fa-linkedin-in"></i>
                                                </a>
                                            </li>
                                            <li>
                                                <a href={profile.github}>
                                                    <i className="fab fa-github"></i>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <a href="/editProfile" className="button">Manage Profile</a>
                                </div>
                            </div>

                            <div className="col-lg-8 col-md-7">
                                <div className="team-single-text padding-50px-left sm-no-padding-left">
                                    <h1>Welcome, {role}</h1>
                                    <h4 className="font-size38 sm-font-size32 xs-font-size30">{profile.name}</h4>
                                    <p className="no-margin-bottom">{profile.bio}</p>
                                    <div className="contact-info-section margin-40px-tb padding-left:10px">
                                        <ul className="list-style9 no-margin">
                                            <li>
                                                <div className="row">
                                                    <div className="col-md-5 col-5">
                                                        <i className="fas fa-graduation-cap text-orange"></i>
                                                        <strong className="margin-10px-left text-orange">Degree:</strong>
                                                    </div>
                                                    <div className="col-md-7 col-7">
                                                        <p>{profile.education}</p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="row">
                                                    <div className="col-md-5 col-5">
                                                        <i className="far fa-gem text-yellow"></i>
                                                        <strong className="margin-10px-left text-yellow">Experience:</strong>
                                                    </div>
                                                    <div className="col-md-7 col-7">
                                                        <p>{profile.experience}</p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="row">
                                                    <div className="col-md-5 col-5">
                                                        <i className="far fa-file text-lightred"></i>
                                                        <strong className="margin-10px-left text-lightred">Courses:</strong>
                                                    </div>
                                                    <div className="col-md-7 col-7">
                                                        <p>{profile.course}</p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="row">
                                                    <div className="col-md-5 col-5">
                                                        <i className="fas fa-map-marker-alt text-green"></i>
                                                        <strong className="margin-10px-left text-green">Address:</strong>
                                                    </div>
                                                    <div className="col-md-7 col-7">
                                                        <p>{profile.address}</p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="row">
                                                    <div className="col-md-5 col-5">
                                                        <i className="fas fa-mobile-alt text-purple"></i>
                                                        <strong className="margin-10px-left xs-margin-four-left text-purple">Phone:</strong>
                                                    </div>
                                                    <div className="col-md-7 col-7">
                                                        <p>{profile.phone_number}</p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="row">
                                                    <div className="col-md-5 col-5">
                                                        <i className="fas fa-envelope text-pink"></i>
                                                        <strong className="margin-10px-left xs-margin-four-left text-pink">Email:</strong>
                                                    </div>
                                                    <div className="col-md-7 col-7">
                                                        <p><a href="javascript:void(0)">{profile.email}</a></p>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <h2>Projects you are working on currently:</h2>
                                    <div className="progress-background-card">
                                        <div className="progress-card-layout">
                                            {/* <div className="progress-items"> */}
                                            <div className={`progress-items profile ${isScrollable ? "scrollable" : ""}`}>
                                                {projects.map((project, index) => (
                                                    <div
                                                        className="progress-card profile"
                                                        key={index}
                                                        onClick={() => openModal(project)}
                                                    >
                                                        <div className="progress-image">
                                                            <img
                                                                className="image"
                                                                src="/img2.jpg"
                                                                alt="project"
                                                            />
                                                        </div>
                                                        <div className="progress-content">
                                                            <span className="progress-category">
                                                                {project.category}
                                                            </span>
                                                            <div className="progress-title">
                                                                {/* {project.project_name} */}
                                                                {project.project_name || "Default Project Name"}
                                                            </div>
                                                            <div className="progress-bar-container">
                                                                <div className="progress-bar">
                                                                    <div
                                                                        className="progress"
                                                                        style={{ width: `${project.progress}%` }}
                                                                    ></div>
                                                                </div>
                                                                <span className="progress-text">
                                                                    {project.progress}%
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>==
                        </div>
                    </div>
                    <Modal
                        size="xl"
                        show={isModalOpen}
                        onHide={closeModal}
                        onEscapeKeyDown={closeModal}
                        scrollable
                        aria-labelledby="milestone_details_modal"
                    >
                        <Modal.Header closeButton>
                            <Modal.Title id="milestone_details_modal" className='modal_text_header'>
                                Project Details
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {selectedProject && selectedProjectDetails && (
                                <>
                                    <Table responsive='sm' bordered hover>
                                        <tbody>
                                            <tr>
                                                <td colSpan={12} className='proj-details-header'>Project Name: {selectedProjectDetails.project_name}</td>
                                            </tr>
                                            {projDescList.map((p, i) => (
                                                <tr key={i}>
                                                    <>
                                                        <td className='proj-details-sub-header'>{p[0]}</td>
                                                        <td className='proj-details-data'>{p[1]}</td>
                                                    </>

                                                </tr>
                                            ))}
                                            <tr>
                                                <td className='proj-details-sub-header'>End Date</td>
                                                {<td className='proj-details-data'>{selectedProjectDetails.end_date}</td>}
                                            </tr>
                                            <tr>
                                                <td className="proj-details-sub-header">Status</td>
                                                <td className="proj-details-data">{selectedProjectDetails.status_desc}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <div className="row">
                                <div className="col-12 text-center">
                                    <button className="text-center button_text button-home"
                                        onClick={closeModal}>Close</button>
                                </div>
                            </div>
                        </Modal.Footer>
                    </Modal>
                </div>
            )}
            {/* student proile ends */}

            {/* supervisor profile starts */}
            {role === 'supervisor' && (
                <div className="container">
                    <div className="team-single">
                        <div className="row">
                            <div className="col-lg-4 col-md-5 xs-margin-30px-bottom">
                                <div className="team-single-img">
                                    <img className="image" src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="" />
                                    {/* <img src="/m3.jpg"></img> */}
                                </div>
                                <div className="bg-light-gray padding-30px-all md-padding-25px-all sm-padding-20px-all text-center">
                                    <h4 className="margin-10px-bottom font-size24 md-font-size22 sm-font-size20 font-weight-600">Full Stack Developer</h4>
                                    <p className="sm-width-95 sm-margin-auto">{profile.skills}</p>
                                    <div className="margin-20px-top team-single-icons">
                                        <ul className="no-margin">
                                            <li><a href={profile.linkedin}><i className="fab fa-linkedin-in"></i></a></li>
                                            <li><a href={profile.github}><i className="fab fa-github"></i></a></li>
                                            <li><a href="javascript:void(0)"><i className="fab fa-google-plus-g"></i></a></li>
                                            <li><a href="javascript:void(0)"><i className="fab fa-instagram"></i></a></li>
                                        </ul>
                                    </div>
                                    {/* <button className="submit">Manage Profile</button> */}
                                    <a href="/editProfile" class="button">Manage Profile</a>
                                </div>
                            </div>

                            <div className="col-lg-8 col-md-7">
                                <div className="team-single-text padding-50px-left sm-no-padding-left">
                                    <h1>Welcome, {role}</h1>
                                    <h4 className="font-size38 sm-font-size32 xs-font-size30">{profile.name}</h4>
                                    <p className="no-margin-bottom">{profile.bio} </p>
                                    <div className="contact-info-section margin-40px-tb padding-left:10px">
                                        <ul className="list-style9 no-margin">
                                            <li>
                                                <div className="row">
                                                    <div className="col-md-5 col-5">
                                                        <i className="fas fa-graduation-cap text-orange"></i>
                                                        <strong className="margin-10px-left text-orange">Degree:</strong>
                                                    </div>
                                                    <div className="col-md-7 col-7">
                                                        <p>{profile.education}</p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="row">
                                                    <div className="col-md-5 col-5">
                                                        <i className="far fa-gem text-yellow"></i>
                                                        <strong className="margin-10px-left text-yellow">Experience:</strong>
                                                    </div>
                                                    <div className="col-md-7 col-7">
                                                        <p>{profile.experience}</p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="row">
                                                    <div className="col-md-5 col-5">
                                                        <i className="far fa-file text-lightred"></i>
                                                        <strong className="margin-10px-left text-lightred">Courses:</strong>
                                                    </div>
                                                    <div className="col-md-7 col-7">
                                                        <p>{profile.course}</p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="row">
                                                    <div className="col-md-5 col-5">
                                                        <i className="fas fa-map-marker-alt text-green"></i>
                                                        <strong className="margin-10px-left text-green">Address:</strong>
                                                    </div>
                                                    <div className="col-md-7 col-7">
                                                        <p>{profile.address}</p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="row">
                                                    <div className="col-md-5 col-5">
                                                        <i className="fas fa-mobile-alt text-purple"></i>
                                                        <strong className="margin-10px-left xs-margin-four-left text-purple">Phone:</strong>
                                                    </div>
                                                    <div className="col-md-7 col-7">
                                                        <p>{profile.phone_number}</p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="row">
                                                    <div className="col-md-5 col-5">
                                                        <i className="fas fa-envelope text-pink"></i>
                                                        <strong className="margin-10px-left xs-margin-four-left text-pink">Email:</strong>
                                                    </div>
                                                    <div className="col-md-7 col-7">
                                                        <p><a href="javascript:void(0)">{profile.email}</a></p>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* <button className="submit">View Projects</button> */}
                                    <h2>Projects you are supervising currently : </h2>
                                    {/* <div className='progress-background-card'>
                                        <div className='progress-card-layout'>
                                            <div className='progress-items'>
                                                {projects.map((project, index) => (
                                                    <div className="progress-card" key={index}>
                                                        <div className="progress-image">
                                                            <img className = "image" src="/img2.jpg" alt="project" />
                                                        </div>
                                                        <div className="progress-content">
                                                            <span className="progress-category">{project.category}</span>
                                                            <div className="progress-title">{project.project_name}</div>
                                                            <div className="progress-bar-container">
                                                                <div className="progress-bar">
                                                                    <div
                                                                        className="progress"
                                                                        style={{ width: `${project.progress}%` }}
                                                                    ></div>
                                                                </div>
                                                                <span className="progress-text">{project.progress}%</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div> */}
                                    <div className="progress-background-card">
                                        <div className="progress-card-layout">
                                            {/* <div className="progress-items"> */}
                                            <div className={`progress-items profile ${isScrollable ? "scrollable" : ""}`}>
                                                {projects.map((project, index) => (
                                                    <div
                                                        className="progress-card profile"
                                                        key={index}
                                                        onClick={() => openModal(project)}
                                                    >
                                                        <div className="progress-image">
                                                            <img
                                                                className="image"
                                                                src="/img2.jpg"
                                                                alt="project"
                                                            />
                                                        </div>
                                                        <div className="progress-content">
                                                            <span className="progress-category">
                                                                {project.category}
                                                            </span>
                                                            <div className="progress-title">
                                                                {/* {project.project_name} */}
                                                                {project.project_name || "Default Project Name"}
                                                            </div>
                                                            <div className="progress-bar-container">
                                                                <div className="progress-bar">
                                                                    <div
                                                                        className="progress"
                                                                        style={{ width: `${project.progress}%` }}
                                                                    ></div>
                                                                </div>
                                                                <span className="progress-text">
                                                                    {project.progress}%
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Modal
                        size="xl"
                        show={isModalOpen}
                        onHide={closeModal}
                        onEscapeKeyDown={closeModal}
                        scrollable
                        aria-labelledby="milestone_details_modal"
                    >
                        <Modal.Header closeButton>
                            <Modal.Title id="milestone_details_modal" className='modal_text_header'>
                                Project Details
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {selectedProject && selectedProjectDetails && (
                                <>
                                    <Table responsive='sm' bordered hover>
                                        <tbody>
                                            <tr>
                                                <td colSpan={12} className='proj-details-header'>Project Name: {selectedProjectDetails.project_name}</td>
                                            </tr>
                                            {projDescList.map((p, i) => (
                                                <tr key={i}>
                                                    <>
                                                        <td className='proj-details-sub-header'>{p[0]}</td>
                                                        <td className='proj-details-data'>{p[1]}</td>
                                                    </>

                                                </tr>
                                            ))}
                                            <tr>
                                                <td className='proj-details-sub-header'>End Date</td>
                                                {<td className='proj-details-data'>{selectedProjectDetails.end_date}</td>}
                                            </tr>
                                            <tr>
                                                <td className="proj-details-sub-header">Status</td>
                                                <td className="proj-details-data">{selectedProjectDetails.status_desc}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <div className="row">
                                <div className="col-12 text-center">
                                    <button className="text-center button_text button-home"
                                        onClick={closeModal}>Close</button>
                                </div>
                            </div>
                        </Modal.Footer>
                    </Modal>
                </div>
            )}
            {/* supervisor profile ends */}
            {role === 'business_owner' && (
                <div className="container">
                    <div className="team-single">
                        <div className="row">
                            <div className="col-lg-4 col-md-5 xs-margin-30px-bottom">
                                <div className="team-single-img">
                                    <img className="image" src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="" />
                                    {/* <img src="/m3.jpg"></img> */}
                                </div>
                                <div className="bg-light-gray padding-30px-all md-padding-25px-all sm-padding-20px-all text-center">
                                    <h4 className="margin-10px-bottom font-size24 md-font-size22 sm-font-size20 font-weight-600">Full Stack Developer</h4>
                                    <p className="sm-width-95 sm-margin-auto">{profile.skills}</p>
                                    <div className="margin-20px-top team-single-icons">
                                        <ul className="no-margin">
                                            <li><a href={profile.linkedin}><i className="fab fa-linkedin-in"></i></a></li>
                                            <li><a href={profile.github}><i className="fab fa-github"></i></a></li>
                                            <li><a href="javascript:void(0)"><i className="fab fa-google-plus-g"></i></a></li>
                                            <li><a href="javascript:void(0)"><i className="fab fa-instagram"></i></a></li>
                                        </ul>
                                    </div>
                                    {/* <button className="submit">Manage Profile</button> */}
                                    <a href="/editProfile" class="button">Manage Profile</a>
                                </div>
                            </div>

                            <div className="col-lg-8 col-md-7">
                                <div className="team-single-text padding-50px-left sm-no-padding-left">
                                    <h1>Welcome, {role}</h1>
                                    <h4 className="font-size38 sm-font-size32 xs-font-size30">{profile.name}</h4>
                                    <p className="no-margin-bottom">{profile.bio} </p>
                                    <div className="contact-info-section margin-40px-tb padding-left:10px">
                                        <ul className="list-style9 no-margin">
                                            <li>
                                                <div className="row">
                                                    <div className="col-md-5 col-5">
                                                        <i className="fas fa-graduation-cap text-orange"></i>
                                                        <strong className="margin-10px-left text-orange">Business Type:</strong>
                                                    </div>
                                                    <div className="col-md-7 col-7">
                                                        <p>{profile.business_type}</p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="row">
                                                    <div className="col-md-5 col-5">
                                                        <i className="far fa-gem text-yellow"></i>
                                                        <strong className="margin-10px-left text-yellow">Domain:</strong>
                                                    </div>
                                                    <div className="col-md-7 col-7">
                                                        <p>{profile.domain_type}</p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="row">
                                                    <div className="col-md-5 col-5">
                                                        <i className="fas fa-map-marker-alt text-green"></i>
                                                        <strong className="margin-10px-left text-green">Address:</strong>
                                                    </div>
                                                    <div className="col-md-7 col-7">
                                                        <p>{profile.address}</p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="row">
                                                    <div className="col-md-5 col-5">
                                                        <i className="fas fa-mobile-alt text-purple"></i>
                                                        <strong className="margin-10px-left xs-margin-four-left text-purple">Phone:</strong>
                                                    </div>
                                                    <div className="col-md-7 col-7">
                                                        <p>{profile.phone_number}</p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="row">
                                                    <div className="col-md-5 col-5">
                                                        <i className="fas fa-envelope text-pink"></i>
                                                        <strong className="margin-10px-left xs-margin-four-left text-pink">Email:</strong>
                                                    </div>
                                                    <div className="col-md-7 col-7">
                                                        <p><a href="javascript:void(0)">{profile.email}</a></p>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* <button className="submit">View Projects</button> */}
                                    <h2>Projects you have listed currrently : </h2>
                                    {/* <div className='progress-background-card'>
                                        <div className='progress-card-layout'>
                                            <div className='progress-items profile'>
                                                {projects.map((project, index) => (
                                                    <div className="progress-card profile" key={index}>
                                                        <div className="progress-image">
                                                            <img className="image" src="/img2.jpg" alt="project" />
                                                        </div>
                                                        <div className="progress-content">
                                                            <span className="progress-category">{project.category}</span>
                                                            <div className="progress-title">{project.project_name}</div>
                                                            <div className="progress-bar-container">
                                                                <div className="progress-bar">
                                                                    <div
                                                                        className="progress"
                                                                        style={{ width: `${project.progress}%` }}
                                                                    ></div>
                                                                </div>
                                                                <span className="progress-text">{project.progress}%</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div> */}
                                    <div className="progress-background-card">
                                        <div className="progress-card-layout">
                                            {/* <div className="progress-items"> */}
                                            <div className={`progress-items profile ${isScrollable ? "scrollable" : ""}`}>
                                                {projects.map((project, index) => (
                                                    <div
                                                        className="progress-card profile"
                                                        key={index}
                                                        onClick={() => openModal(project)}
                                                    >
                                                        <div className="progress-image">
                                                            <img
                                                                className="image"
                                                                src="/img2.jpg"
                                                                alt="project"
                                                            />
                                                        </div>
                                                        <div className="progress-content">
                                                            <span className="progress-category">
                                                                {project.category}
                                                            </span>
                                                            <div className="progress-title">
                                                                {/* {project.project_name} */}
                                                                {project.project_name || "Default Project Name"}
                                                            </div>
                                                            <div className="progress-bar-container">
                                                                <div className="progress-bar">
                                                                    <div
                                                                        className="progress"
                                                                        style={{ width: `${project.progress}%` }}
                                                                    ></div>
                                                                </div>
                                                                <span className="progress-text">
                                                                    {project.progress}%
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Modal
                        size="xl"
                        show={isModalOpen}
                        onHide={closeModal}
                        onEscapeKeyDown={closeModal}
                        scrollable
                        aria-labelledby="milestone_details_modal"
                    >
                        <Modal.Header closeButton>
                            <Modal.Title id="milestone_details_modal" className='modal_text_header'>
                                Project Details
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {selectedProject && selectedProjectDetails && (
                                <>
                                    <Table responsive='sm' bordered hover>
                                        <tbody>
                                            <tr>
                                                <td colSpan={12} className='proj-details-header'>Project Name: {selectedProjectDetails.project_name}</td>
                                            </tr>
                                            {projDescList.map((p, i) => (
                                                <tr key={i}>
                                                    <>
                                                        <td className='proj-details-sub-header'>{p[0]}</td>
                                                        <td className='proj-details-data'>{p[1]}</td>
                                                    </>

                                                </tr>
                                            ))}
                                            <tr>
                                                <td className='proj-details-sub-header'>End Date</td>
                                                {<td className='proj-details-data'>{selectedProjectDetails.end_date}</td>}
                                            </tr>
                                            <tr>
                                                <td className="proj-details-sub-header">Status</td>
                                                <td className="proj-details-data">{selectedProjectDetails.status_desc}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <div className="row">
                                <div className="col-12 text-center">
                                    <button className="text-center button_text button-home"
                                        onClick={closeModal}>Close</button>
                                </div>
                            </div>
                        </Modal.Footer>
                    </Modal>
                </div>
            )}
            {/* buisness owner profile ends */}
        </>
    );
};

export default ProfileComponent;
