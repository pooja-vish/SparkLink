import MasterComponent from '../MasterComponent';
import '../progress-tracker/ProgressTrackerComponent.css';
import MenuComponent from '../menu/MenuComponent';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfileComponent.css';
import { useAuth } from '../../AuthContext';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import { useSearchParams } from 'react-router-dom';
import photo1 from '../../assets/project_images/photo1.jpg';
import photo2 from '../../assets/project_images/photo2.jpg';
import photo3 from '../../assets/project_images/photo3.jpg';
import photo4 from '../../assets/project_images/photo4.jpg';
import photo5 from '../../assets/project_images/photo5.jpg';
import photo6 from '../../assets/project_images/photo6.jpg';
import photo7 from '../../assets/project_images/photo7.jpg';
import photo8 from '../../assets/project_images/photo8.jpg';
import photo9 from '../../assets/project_images/photo9.jpg';
import photo10 from '../../assets/project_images/photo10.jpg';
import remove_icon from '../../assets/remove_icon.png';
import report_icon from '../../assets/report_icon.png';

// Array of images
const imageArray = [photo1, photo2, photo3, photo4, photo5, photo6, photo7, photo8, photo9, photo10];

const ProfileComponent = () => {
    const { user, isAuthenticated } = useAuth();
    const [role, setRole] = useState(null);
    const [profile, setProfile] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    // const [projects, setProjects] = useState([]);
    const [projectDetails, setProjectDetails] = useState([]);
    const [selectedProjectDetails, setSelectedProjectDetails] = useState([]);
    const [projDescList, setProjDescList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null); // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
    const [isScrollable, setIsScrollable] = useState(false);
    const [searchParams] = useSearchParams();
    const user_id_param = searchParams.get('user_id');
    const [projectList, setProjectList] = useState([]);

    const fetchProfile = async (user_id) => {
        //const user_id = user.user_id;
        console.log("PROF>>>>>", user_id);
        if (user) {
            try {
                const response = await axios.get("/profile", {
                    params: { user_id: user_id }
                });
                // console.log('profile data = ', response.data);
                // setRole(response.data.role);
                // setProfile(response.data.profile);
                // setUserDetails(response.data.user_details);
                // // setProjects(response.data.projects);
                // setProjectDetails(response.data.project_details);
                setRole(response.data.role);
                setProfile(response.data.profile);
                setUserDetails(response.data.user_details);
                setProjectList(response.data.projects);
                console.log("VOILA>>>>>", response.data);
                // console.log("Is Array:", Array.isArray(projectDetails));
                setLoading(false);
            } catch (err) {
                setError('Error fetching profile FE');
                setLoading(false);
            }
        } else {
            console.log('no user', user);
        }
    };

    useEffect(() => {
        console.log("TEST PROJ FETCH>>>>>", projectDetails);
    }, [projectDetails])

    const openModal = (project) => {
        console.log('==project==', project);
        setSelectedProject(project);
        const project_Desc = projectList.find(p => p.proj_id === project.proj_id);
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
            fetchProfile(user_id_param || user.user_id);
        }
    }, [user, user_id_param]);

    useEffect(() => {
        console.log("projects count : ", projectDetails.length);
        setIsScrollable(projectDetails.length > 3);
    }, [projectDetails]);

    useEffect(() => {
        console.log("selectedProjectDetails =1", selectedProjectDetails);
        // if (selectedProject && selectedProjectDetails) {
        //     console.log('split wala =>', selectedProjectDetails.proj_desc);
        //     let splitDesc = selectedProjectDetails.proj_desc.split(";");
        //     console.log("splitDesc=>", splitDesc);
        //     let filterDesc = [];
        //     for (let i = 0; i < splitDesc.length; i++) {
        //         filterDesc[i] = splitDesc[i].trim().split(":");
        //     }
        //     setProjDescList(filterDesc);
        // }
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
                                            <li><a href={profile.linkedin}><i className="fab fa-linkedin-in"></i></a></li>
                                            <li><a href={profile.github}><i className="fab fa-github"></i></a></li>
                                        </ul>
                                    </div>
                                    {user_id_param ? (
                                        user.user_id === Number(user_id_param) && (
                                            <a href="/editProfile" className="button">Manage Profile</a>
                                        )
                                    ) : null}
                                </div>
                            </div>

                            <div className="col-lg-8 col-md-7">
                                <div className="team-single-text padding-50px-left sm-no-padding-left">
                                    <h1>Welcome, {userDetails.username}</h1>
                                    <h4 className="font-size38 sm-font-size32 xs-font-size30">{userDetails.name}</h4>
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
                                                        <p>{userDetails.email}</p>
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
                                                {projectList.map((project, index) => (
                                                    <div
                                                        className="progress-card profile"
                                                        key={index}
                                                        onClick={() => openModal(project)}
                                                    >
                                                        <div className="progress-image"
                                                            style={{
                                                                backgroundImage: `url(${imageArray[Number(project.image_url)] || ''})`,
                                                                backgroundSize: 'cover',
                                                                backgroundPosition: 'center'

                                                            }}
                                                            loading="lazy">
                                                        </div>
                                                        <div className="progress-content">
                                                            <div className="progress-title">
                                                                {/* {project.project_name} */}
                                                                {project.project_name}
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
                                            {/* {projDescList.map((p, i) => (
                                                <tr key={i}>
                                                    <>
                                                        <td className='proj-details-sub-header'>{p[0]}</td>
                                                        <td className='proj-details-data'>{p[1]}</td>
                                                    </>

                                                </tr>
                                            ))} */}
                                            <tr>
                                                <td className='proj-details-sub-header'>Purpose</td>
                                                {<td className='proj-details-data'>{selectedProjectDetails.purpose}</td>}
                                            </tr>
                                            <tr>
                                                <td className='proj-details-sub-header'>Product</td>
                                                {<td className='proj-details-data'>{selectedProjectDetails.product}</td>}
                                            </tr>
                                            <tr>
                                                <td className='proj-details-sub-header'>Description</td>
                                                {<td className='proj-details-data'>{selectedProjectDetails.description}</td>}
                                            </tr>
                                            <tr>
                                                <td className='proj-details-sub-header'>Features</td>
                                                {<td className='proj-details-data'>{selectedProjectDetails.features}</td>}
                                            </tr>
                                            <tr>
                                                <td className='proj-details-sub-header'>Budget</td>
                                                {<td className='proj-details-data'>{selectedProjectDetails.budget}</td>}
                                            </tr>
                                            <tr>
                                                <td className='proj-details-sub-header'>Skill(s) Required</td>
                                                {<td className='proj-details-data'>{selectedProjectDetails.skills_req}</td>}
                                            </tr>
                                            <tr>
                                                <td className='proj-details-sub-header'>End Date</td>
                                                {<td className='proj-details-data'>{selectedProjectDetails.end_date}</td>}
                                            </tr>
                                            <tr>
                                                <td className="proj-details-sub-header">Status</td>
                                                <td className="proj-details-data">{selectedProjectDetails.status_desc}</td>
                                            </tr>

                                            {["business_owner", "supervisor", "student"].map(role => {
                                                const stakeholdersByRole = (selectedProjectDetails?.stakeholder || []).filter(
                                                    stakeholder => stakeholder.role === role
                                                );

                                                if (stakeholdersByRole.length > 0) {
                                                    return (
                                                        <tr key={role}>
                                                            <td className="proj-details-sub-header">
                                                                {role === "business_owner" && "Business Owner"}
                                                                {role === "supervisor" && "Supervisor(s)"}
                                                                {role === "student" && "Student(s)"}
                                                            </td>
                                                            <td className="proj-details-data">
                                                                {stakeholdersByRole.map(({ name, user_id, proj_id }, index) => (
                                                                    <div
                                                                        key={`${role}-${user_id}`}
                                                                        className="stakeholder-button"
                                                                    >
                                                                        {name}
                                                                    </div>
                                                                ))}
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                                return null;
                                            })}
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
                                </div>
                                <div className="bg-light-gray padding-30px-all md-padding-25px-all sm-padding-20px-all text-center">
                                    <h4 className="margin-10px-bottom font-size24 md-font-size22 sm-font-size20 font-weight-600">Full Stack Developer</h4>
                                    <p className="sm-width-95 sm-margin-auto">{profile.skills}</p>
                                    <div className="margin-20px-top team-single-icons">
                                        <ul className="no-margin">
                                            <li><a href={profile.linkedin}><i className="fab fa-linkedin-in"></i></a></li>
                                            <li><a href={profile.github}><i className="fab fa-github"></i></a></li>
                                            {/* <li><a href="javascript:void(0)"><i className="fab fa-google-plus-g"></i></a></li>
                                            <li><a href="javascript:void(0)"><i className="fab fa-instagram"></i></a></li> */}
                                        </ul>
                                    </div>
                                    {user_id_param ? (
                                        user.user_id === Number(user_id_param) && (
                                            <a href="/editProfile" className="button">Manage Profile</a>
                                        )
                                    ) : null}
                                </div>
                            </div>

                            <div className="col-lg-8 col-md-7">
                                <div className="team-single-text padding-50px-left sm-no-padding-left">
                                    <h1>Welcome, {userDetails.username}</h1>
                                    <h4 className="font-size38 sm-font-size32 xs-font-size30">{userDetails.name}</h4>
                                    <p className="no-margin-bottom">{profile.bio} </p>
                                    <div className="contact-info-section margin-40px-tb padding-left:10px">
                                        <ul className="list-style9 no-margin">
                                            <li>
                                                <div className="row">
                                                    <div className="col-md-5 col-5">
                                                        <i className="fas fa-graduation-cap text-orange"></i>
                                                        <strong className="margin-10px-left text-orange">Education:</strong>
                                                    </div>
                                                    <div className="col-md-7 col-7">
                                                        {profile.education ? (
                                                            <p>{profile.education}</p>
                                                        ) : (
                                                            <p style={{ color: "light gray" }}>Add your education, by clicking Manage Profile</p>

                                                        )}
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
                                                        {profile.experience ? (
                                                            <p>{profile.experience}</p>
                                                        ) : (
                                                            <p style={{ color: "light gray" }}>Add your experience, by clicking Manage Profile</p>

                                                        )}
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
                                                        {profile.course ? (
                                                            <p>{profile.course}</p>
                                                        ) : (
                                                            <p style={{ color: "light gray" }}>Add your courses, by clicking Manage Profile</p>

                                                        )}
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
                                                        {profile.address ? (
                                                            <p>{profile.address}</p>
                                                        ) : (
                                                            <p style={{ color: "light gray" }}>Add your address, by clicking Manage Profile</p>

                                                        )}
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
                                                        {profile.phone_number ? (
                                                            <p>{profile.phone_number}</p>
                                                        ) : (
                                                            <p style={{ color: "light gray" }}>Add your Phone number, by clicking Manage Profile</p>

                                                        )}
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
                                                        <p>{userDetails.email}</p>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>

                                    <h2>Projects you are supervising currently : </h2>
                                    <div className="progress-background-card">
                                        <div className="progress-card-layout">
                                            {/* <div className="progress-items"> */}
                                            <div className={`progress-items profile ${isScrollable ? "scrollable" : ""}`}>
                                                {projectList.map((project, index) => (
                                                    <div
                                                        className="progress-card profile"
                                                        key={index}
                                                        onClick={() => openModal(project)}
                                                    >
                                                        <div className="progress-image"
                                                            style={{
                                                                backgroundImage: `url(${imageArray[Number(project.image_url)] || ''})`,
                                                                backgroundSize: 'cover',
                                                                backgroundPosition: 'center'

                                                            }}
                                                            loading="lazy">
                                                        </div>
                                                        <div className="progress-content">
                                                            <div className="progress-title">
                                                                {/* {project.project_name} */}
                                                                {project.project_name}
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
                                            {/* {projDescList.map((p, i) => (
                                                <tr key={i}>
                                                    <>
                                                        <td className='proj-details-sub-header'>{p[0]}</td>
                                                        <td className='proj-details-data'>{p[1]}</td>
                                                    </>

                                                </tr>
                                            ))} */}
                                            <tr>
                                                <td className='proj-details-sub-header'>Purpose</td>
                                                {<td className='proj-details-data'>{selectedProjectDetails.purpose}</td>}
                                            </tr>
                                            <tr>
                                                <td className='proj-details-sub-header'>Product</td>
                                                {<td className='proj-details-data'>{selectedProjectDetails.product}</td>}
                                            </tr>
                                            <tr>
                                                <td className='proj-details-sub-header'>Description</td>
                                                {<td className='proj-details-data'>{selectedProjectDetails.description}</td>}
                                            </tr>
                                            <tr>
                                                <td className='proj-details-sub-header'>Features</td>
                                                {<td className='proj-details-data'>{selectedProjectDetails.features}</td>}
                                            </tr>
                                            <tr>
                                                <td className='proj-details-sub-header'>Budget</td>
                                                {<td className='proj-details-data'>{selectedProjectDetails.budget}</td>}
                                            </tr>
                                            <tr>
                                                <td className='proj-details-sub-header'>Skill(s) Required</td>
                                                {<td className='proj-details-data'>{selectedProjectDetails.skills_req}</td>}
                                            </tr>
                                            <tr>
                                                <td className='proj-details-sub-header'>End Date</td>
                                                {<td className='proj-details-data'>{selectedProjectDetails.end_date}</td>}
                                            </tr>
                                            <tr>
                                                <td className="proj-details-sub-header">Status</td>
                                                <td className="proj-details-data">{selectedProjectDetails.status_desc}</td>
                                            </tr>

                                            {["business_owner", "supervisor", "student"].map(role => {
                                                const stakeholdersByRole = (selectedProjectDetails?.stakeholder || []).filter(
                                                    stakeholder => stakeholder.role === role
                                                );

                                                if (stakeholdersByRole.length > 0) {
                                                    return (
                                                        <tr key={role}>
                                                            <td className="proj-details-sub-header">
                                                                {role === "business_owner" && "Business Owner"}
                                                                {role === "supervisor" && "Supervisor(s)"}
                                                                {role === "student" && "Student(s)"}
                                                            </td>
                                                            <td className="proj-details-data">
                                                                {stakeholdersByRole.map(({ name, user_id, proj_id }, index) => (
                                                                    <div
                                                                        key={`${role}-${user_id}`}
                                                                        className="stakeholder-button"
                                                                    >
                                                                        {name}
                                                                    </div>
                                                                ))}
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                                return null;
                                            })}
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
                                </div>
                                <div className="bg-light-gray padding-30px-all md-padding-25px-all sm-padding-20px-all text-center">
                                    <h4 className="margin-10px-bottom font-size24 md-font-size22 sm-font-size20 font-weight-600">Full Stack Developer</h4>
                                    <p className="sm-width-95 sm-margin-auto">{profile.skills}</p>
                                    <div className="margin-20px-top team-single-icons">
                                        <ul className="no-margin">
                                            <li><a href={profile.linkedin}><i className="fab fa-linkedin-in"></i></a></li>
                                            <li><a href={profile.github}><i className="fab fa-github"></i></a></li>
                                        </ul>
                                    </div>
                                    {user_id_param ? (
                                        user.user_id === Number(user_id_param) && (
                                            <a href="/editProfile" className="button">Manage Profile</a>
                                        )
                                    ) : null}
                                </div>
                            </div>

                            <div className="col-lg-8 col-md-7">
                                <div className="team-single-text padding-50px-left sm-no-padding-left">
                                    <h1>Welcome, {userDetails.username}</h1>
                                    <h4 className="font-size38 sm-font-size32 xs-font-size30">{userDetails.name}</h4>
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
                                                        {profile.business_type ? (
                                                            <p>{profile.business_type}</p>
                                                        ) : (
                                                            <p style={{ color: "light gray" }}>Add your Business Type, by clicking Manage Profile</p>

                                                        )}
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
                                                        {profile.domain_type ? (
                                                            <p>{profile.domain_type}</p>
                                                        ) : (
                                                            <p style={{ color: "light gray" }}>Add your domain, by clicking Manage Profile</p>

                                                        )}
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
                                                        {profile.address ? (
                                                            <p>{profile.address}</p>
                                                        ) : (
                                                            <p style={{ color: "light gray" }}>Add your address, by clicking Manage Profile</p>

                                                        )}
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
                                                        {profile.phone_number ? (
                                                            <p>{profile.phone_number}</p>
                                                        ) : (
                                                            <p style={{ color: "light gray" }}>Add your Phone number, by clicking Manage Profile</p>

                                                        )}
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
                                                        <p>{userDetails.email}</p>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <h2>Projects you have listed currrently : </h2>
                                    <div className="progress-background-card">
                                        <div className="progress-card-layout">
                                            <div className={`progress-items profile ${isScrollable ? "scrollable" : ""}`}>
                                                {projectList.map((project, index) => (
                                                    <div
                                                        className="progress-card profile"
                                                        key={index}
                                                        onClick={() => openModal(project)}
                                                    >
                                                        <div className="progress-image"
                                                            style={{
                                                                backgroundImage: `url(${imageArray[Number(project.image_url)] || ''})`,
                                                                backgroundSize: 'cover',
                                                                backgroundPosition: 'center'

                                                            }}
                                                            loading="lazy">
                                                        </div>
                                                        <div className="progress-content">
                                                            <div className="progress-title">
                                                                {project.project_name}
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
                                            {/* {projDescList.map((p, i) => (
                                                <tr key={i}>
                                                    <>
                                                        <td className='proj-details-sub-header'>{p[0]}</td>
                                                        <td className='proj-details-data'>{p[1]}</td>
                                                    </>

                                                </tr>
                                            ))} */}
                                            <tr>
                                                <td className='proj-details-sub-header'>Purpose</td>
                                                {<td className='proj-details-data'>{selectedProjectDetails.purpose}</td>}
                                            </tr>
                                            <tr>
                                                <td className='proj-details-sub-header'>Product</td>
                                                {<td className='proj-details-data'>{selectedProjectDetails.product}</td>}
                                            </tr>
                                            <tr>
                                                <td className='proj-details-sub-header'>Description</td>
                                                {<td className='proj-details-data'>{selectedProjectDetails.description}</td>}
                                            </tr>
                                            <tr>
                                                <td className='proj-details-sub-header'>Features</td>
                                                {<td className='proj-details-data'>{selectedProjectDetails.features}</td>}
                                            </tr>
                                            <tr>
                                                <td className='proj-details-sub-header'>Budget</td>
                                                {<td className='proj-details-data'>{selectedProjectDetails.budget}</td>}
                                            </tr>
                                            <tr>
                                                <td className='proj-details-sub-header'>Skill(s) Required</td>
                                                {<td className='proj-details-data'>{selectedProjectDetails.skills_req}</td>}
                                            </tr>
                                            <tr>
                                                <td className='proj-details-sub-header'>End Date</td>
                                                {<td className='proj-details-data'>{selectedProjectDetails.end_date}</td>}
                                            </tr>
                                            <tr>
                                                <td className="proj-details-sub-header">Status</td>
                                                <td className="proj-details-data">{selectedProjectDetails.status_desc}</td>
                                            </tr>

                                            {["business_owner", "supervisor", "student"].map(role => {
                                                const stakeholdersByRole = (selectedProjectDetails?.stakeholder || []).filter(
                                                    stakeholder => stakeholder.role === role
                                                );

                                                if (stakeholdersByRole.length > 0) {
                                                    return (
                                                        <tr key={role}>
                                                            <td className="proj-details-sub-header">
                                                                {role === "business_owner" && "Business Owner"}
                                                                {role === "supervisor" && "Supervisor(s)"}
                                                                {role === "student" && "Student(s)"}
                                                            </td>
                                                            <td className="proj-details-data">
                                                                {stakeholdersByRole.map(({ name, user_id, proj_id }, index) => (
                                                                    <div
                                                                        key={`${role}-${user_id}`}
                                                                        className="stakeholder-button"
                                                                    >
                                                                        {name}
                                                                    </div>
                                                                ))}
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                                return null;
                                            })}
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
