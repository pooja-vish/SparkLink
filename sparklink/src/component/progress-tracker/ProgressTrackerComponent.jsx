import React, { useState, useEffect } from 'react';
import './ProgressTrackerComponent.css';
import MenuComponent from '../menu/MenuComponent';
import MasterComponent from '../MasterComponent';
import FooterComponent from '../footer/FooterComponent';
import axios from 'axios';
import Select from 'react-select';
import delete_icon from '../../assets/delete_icon.png';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import edit_icon from '../../assets/edit_icon.png';
import cancel_icon from '../../assets/cancel_icon.png';
import complete_icon from '../../assets/complete_icon.png';
import resume_icon from '../../assets/resume_icon.png';
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

const ProgressTrackerComponent = () => {
    const location = useLocation();
    const { projId } = location.state || {};
    const [projectList, setProjectList] = useState([]);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [loading, setLoading] = useState(false);
    const [milestoneList, setMilestoneList] = useState([]);
    const [filteredProjList, setFilteredProjList] = useState([]);
    const [milestoneData, setMilestoneData] = useState([]);
    const [proj_id, setProj_id] = useState('');
    const [fetchFlag, setFetchFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [detailsList, setDetailsList] = useState({});
    const [copyOfDetailsList, setCopyOfDetailsList] = useState({});
    const [triggerDetails, setTriggerDetails] = useState(false);
    const [triggerModalFlag, setTriggerModalFlag] = useState(false);
    const [editFlag, setEditFlag] = useState(false);
    const [isMobileView, setIsMobileView] = useState(false);
    const [accessVal, setAccessVal] = useState('');
    const [addMilestoneFlag, setAddMilestoneFlag] = useState(false);
    //const currentDate = new Date();
    const today = new Date().toISOString().split("T")[0];

    useEffect(() => {
        if (projId) {
            getUserRoleAccess(projId);
            ProjMilestones();
        }
    }, [projId]);

    const ProjMilestones = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/progressTracker/projMilestones", {
                params: { proj_id: projId }
            });

            if (response.data.projMilestoneData.length > 0) {
                setMilestoneData(response.data.projMilestoneData);
                setProjectList([]);
                projectList.push(response.data.projData);
                const optionSelect = {
                    label: response.data.projData.project_name,
                    value: response.data.projData.project_name
                }
                handleSelectChange(optionSelect);
            } else {
                projectList.push(response.data.projData);
                const optionSelect = {
                    label: response.data.projData.project_name,
                    value: response.data.projData.project_name
                }
                handleSelectChange(optionSelect);
                if (accessVal === 'S' || accessVal === 'SU' || accessVal === 'ST') {
                    setMilestoneList([{ proj_id: '', milestone_desc: '', milestone_title: '', end_date: '' }]);
                }
            }
        } catch (error) {
            //setError(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 768);
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleAddMilestone = () => {
        setMilestoneList([...milestoneList, { proj_id: '', milestone_desc: '', milestone_title: '', end_date: '' }]);
        setAddMilestoneFlag(true);
    }

    useEffect(() => {
        if (milestoneList.length === 0) {
            setAddMilestoneFlag(false);
        }
    }, [milestoneList]);

    const deleteMilestone = (index) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to Cancel adding this milestone? This change cannot be undone',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                setMilestoneList(prevList => {
                    const updatedList = [...prevList];
                    updatedList.splice(index, 1);
                    return updatedList;
                });
            }
        });
    }

    const handleMilestoneChange = (index, event) => {
        const { name, value } = event.target;
        const updatedMilestones = [...milestoneList];
        if (filteredProjList.length > 0 && filteredProjList[0].proj_id) {
            updatedMilestones[index].proj_id = filteredProjList[0].proj_id;
            updatedMilestones[index][name] = value;
        }
        setMilestoneList(updatedMilestones);
    };

    // Function to fetch search suggestions based on query
    const fetchSuggestions = async (query) => {
        setLoading(true);
        try {
            const response = await axios.get('/progressTracker/filterProjMilestones', {
                params: { projName: query },
            });
            setProjectList(response.data);
            const formattedSuggestions = response.data.map((suggestion) => ({
                label: suggestion.project_name,
                value: suggestion.project_name,
            }));
            setSuggestions(formattedSuggestions);
        } catch (err) {
            Swal.fire({ title: 'Error', text: err.message, icon: 'error', confirmButtonText: 'Ok' });
            //setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (inputValue) => {
        setSearchQuery(inputValue);
        if (inputValue.trim()) {
            fetchSuggestions(inputValue);
        } else {
            setSuggestions([]);
        }
    };

    const handleSelectChange = (selectedOption) => {
        setSelectedOption(selectedOption);

        if (selectedOption) {
            setSearchQuery(selectedOption.label);
            const filteredProjects = projectList.filter((item) =>
                item.project_name && selectedOption.value &&
                item.project_name.toLowerCase() === selectedOption.value.toLowerCase()
            );

            //setMilestoneList([{ proj_id: '', milestone_desc: '' }]);
            setFilteredProjList(filteredProjects);
            getUserRoleAccess(filteredProjects[0].proj_id);
            setProj_id(filteredProjects[0].proj_id);
            setMilestoneData([]);
            setFetchFlag(true);
        } else {
            setSearchQuery('');
            setSuggestions([]);
            setFilteredProjList([]);
            setMilestoneList([]);
            setMilestoneData([]);
        }
    };

    const fetchMilestone = async () => {
        setLoading(true);
        try {
            const response = await axios.post('/progressTracker/fetchMilestone', {
                proj_id: proj_id
            });
            if (response.data.milestoneData.length > 0) {
                setMilestoneData(response.data.milestoneData);
            } else {
                setMilestoneData([]);
                if (accessVal === 'S' || accessVal === 'SU' || accessVal === 'ST') {
                    setMilestoneList([{ proj_id: '', milestone_desc: '', milestone_title: '', end_date: '' }]);
                }
            }
        } catch (err) {
            Swal.fire({ title: 'Error', text: err.message, icon: 'error', confirmButtonText: 'Ok' });
            //setError(err.message);
        } finally {
            setFetchFlag(false);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (fetchFlag) {
            fetchMilestone();
        }
    }, [fetchFlag]);

    const saveMilestone = async (query) => {
        query.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('/progressTracker/createMilestone', {
                milestoneList: milestoneList
            });

            if (response.status === 201) {
                fetchMilestone();
                setMilestoneList([]);
                Swal.fire({
                    title: 'Success',
                    text: response.data.message,
                    icon: 'success',
                    confirmButtonText: 'Ok'
                });
            }
        } catch (err) {
            if (err.response) {
                Swal.fire({
                    title: 'Error',
                    text: err.response.data.message,
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: err.message,
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
            }
            //setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const openMilestoneDetails = (milestoneId) => {
        let filteredMilestone = null;

        for (let i = 0; i < milestoneData.length; i++) {
            if (milestoneData[i].milestone_id === milestoneId) {
                filteredMilestone = milestoneData[i];
                setDetailsList(filteredMilestone);
                setTriggerModalFlag(true);
                break;
            }
        }
    }

    useEffect(() => {
        if (detailsList && triggerModalFlag) {
            setTriggerDetails(true);
        }
    }, [detailsList, triggerModalFlag]);

    const closeModal = () => {
        setDetailsList(null);
        setTriggerDetails(false);
        setEditFlag(false);
        // if (editFlag) {
        //     setDetailsList({});
        //     setEditFlag(false);
        // }
    }

    const triggerUpdate = async (triggerKey) => {
        if (triggerKey === 'U') {
            setEditFlag(true);
            setCopyOfDetailsList(detailsList);
        } else if (triggerKey === 'C') {
            setEditFlag(false);
            setDetailsList(copyOfDetailsList);
        }
    }

    const updateMilestoneData = async () => {
        setLoading(true);
        try {
            const response = await axios.post('/progressTracker/updateMilestone', {
                milestoneList: detailsList
            });
            if (response.status === 200) {
                if (editFlag) {
                    //setDetailsList({});
                    setEditFlag(false);
                }
                Swal.fire({
                    title: 'Success',
                    text: response.data.message,
                    icon: 'success',
                    confirmButtonText: 'Ok'
                });
            }
        } catch (err) {
            if (err.response) {
                Swal.fire({
                    title: 'Error',
                    text: err.response.data.message,
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: err.message,
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
            }
            //setError(err.message);
        } finally {
            fetchMilestone();
            setMilestoneList([]);
            setLoading(false);
        }
    }

    const handleUpdateMilestoneChange = (event) => {
        const { name, value } = event.target;
        const updatedMilestones = { ...detailsList };
        if (detailsList) {
            updatedMilestones.proj_id = detailsList.proj_id;
            updatedMilestones[name] = value;
        }
        setDetailsList(updatedMilestones);
    };

    const removeMilestone = async () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to Delete this Milestone?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true);
                try {
                    const response = await axios.post('/progressTracker/deleteMilestone', {
                        milestoneList: detailsList
                    });

                    if (response.status === 200) {
                        fetchMilestone();
                        closeModal();
                        Swal.fire({
                            title: 'Success',
                            text: response.data.message,
                            icon: 'success',
                            confirmButtonText: 'Ok'
                        });
                    }
                } catch (err) {
                    Swal.fire({ title: 'Error', text: err.message, icon: 'error', confirmButtonText: 'Ok' });
                    //setError(err.message);
                } finally {
                    setMilestoneList([]);
                    setLoading(false);
                }
            }
        });
    }

    const completeMilestone = async () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to mark this Milestone as Completed?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true);
                try {
                    const response = await axios.post('/progressTracker/completeMilestone', {
                        milestoneList: detailsList
                    });

                    if (response.status === 200) {
                        fetchMilestone();
                        closeModal();
                        Swal.fire({
                            title: 'Success',
                            text: response.data.message,
                            icon: 'success',
                            confirmButtonText: 'Ok'
                        });
                    }
                } catch (err) {
                    Swal.fire({ title: 'Error', text: err.message, icon: 'error', confirmButtonText: 'Ok' });
                    //setError(err.message);
                } finally {
                    setMilestoneList([]);
                    setLoading(false);
                }
            }
        });
    }

    const resumeMilestone = async () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to Resume this Milestone?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true);
                try {
                    const response = await axios.post('/progressTracker/resumeMilestone', {
                        milestoneList: detailsList
                    });

                    if (response.status === 200) {
                        fetchMilestone();
                        closeModal();
                        Swal.fire({
                            title: 'Success',
                            text: response.data.message,
                            icon: 'success',
                            confirmButtonText: 'Ok'
                        });
                    }
                } catch (err) {
                    Swal.fire({ title: 'Error', text: err.message, icon: 'error', confirmButtonText: 'Ok' });
                    //setError(err.message);
                } finally {
                    setMilestoneList([]);
                    setLoading(false);
                }
            }
        });
    }

    const getUserRoleAccess = async (proj_id) => {
        setLoading(true);
        try {
            const response = await axios.post('/progressTracker/getUserRoleAccess', {
                proj_id: proj_id
            });
            setAccessVal(response.data.access_val);
        } catch (error) {
            Swal.fire({ title: 'Error', text: error.message, icon: 'error', confirmButtonText: 'Ok' });
            //setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <div className="page-container">
                <div className="content-container">
                    <MenuComponent />
                    <MasterComponent />
                    <div className="container-fluid mb-5">

                        <div className="milestone_container">
                            <div className="row">

                                <div className="col-lg-1 col-md-1 col-sm-3"></div>
                                <div className="col-lg-11 col-md-11 col-sm-9">
                                    <div className="milestone_Heading">
                                        <span>Track your Milestone</span>
                                    </div>
                                    <div className="search-container">
                                        <Select
                                            value={selectedOption}
                                            onChange={handleSelectChange}
                                            onInputChange={handleInputChange}
                                            options={suggestions}
                                            placeholder="Search by Project name"
                                            isClearable
                                            className="search-select-text search-select search-input"
                                        />
                                    </div>
                                    {filteredProjList.length > 0 && (<div className="createproject_layout">

                                        <div className="milestone_form">
                                            <form>
                                                <label className="milestone_label">
                                                    Project Milestones
                                                    {/* <span className="text-danger"> *</span> */}
                                                </label>

                                                {milestoneData.length > 0 && Array.isArray(milestoneData) && (
                                                    <div className="row">
                                                        {milestoneData.map((milestone, index) => {
                                                            let backgroundColor;
                                                            const milestoneEndDate = new Date(milestone.end_date).toISOString().split("T")[0];

                                                            if (milestoneEndDate < today && milestone.is_completed === 'N') {
                                                                backgroundColor = '#FF3300';
                                                            } else if (milestone.is_completed === 'Y') {
                                                                backgroundColor = '#3CB371';
                                                            } else {
                                                                backgroundColor = '#FFCE00';
                                                            }

                                                            return (
                                                                <div className="col-12 col-md-4 col-lg-2 mb-4 mt-3" key={index}>
                                                                    <div className="box" style={{ backgroundColor, cursor: 'pointer', transition: 'background-color 0.3s ease' }}
                                                                        title='Click to view more details'
                                                                        onClick={() => openMilestoneDetails(milestone.milestone_id)}>
                                                                        <div className="header">
                                                                            {/* <span className="icon">{index + 1}</span>
                                                                            &nbsp; */}
                                                                            <span className='milestone_title_text'>{milestone.milestone_title.length > 20
                                                                                ? `${milestone.milestone_title.slice(0, 18)}...`
                                                                                : milestone.milestone_title}</span>
                                                                        </div>
                                                                        <span className='milestone_text'>{milestone.end_date}</span>
                                                                        <p className='milestone_text'>{milestone.milestone_desc.length > 50
                                                                            ? `${milestone.milestone_desc.slice(0, 18)}...`
                                                                            : milestone.milestone_desc}</p>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                                {!isMobileView && (<Table responsive='sm' bordered>
                                                    <tbody>
                                                        {milestoneList.length > 0 &&
                                                            (<tr className='row text-center'>
                                                                <td className="milestone-details-header col-4">
                                                                    Title
                                                                </td>
                                                                <td className="milestone-details-header col-5">
                                                                    Description
                                                                </td>
                                                                <td className="milestone-details-header col-2">
                                                                    End Date
                                                                </td>
                                                                <td className="milestone-details-header col-1">
                                                                    Delete
                                                                </td>
                                                            </tr>)}
                                                        {milestoneList.map((milestone, index) => (
                                                            <tr key={`milestone_${index}`} className="row milestone-item text-center">
                                                                <td className="milestone-details-data col-4">
                                                                    <input
                                                                        type="text"
                                                                        className="milestone_input_text"
                                                                        name="milestone_title"
                                                                        value={milestone.milestone_title || ""}
                                                                        onChange={(e) => handleMilestoneChange(index, e)}
                                                                        placeholder="Enter milestone title, e.g., Project Kickoff"
                                                                        maxLength={100}
                                                                        required
                                                                    />
                                                                </td>
                                                                <td className="milestone-details-data col-5">
                                                                    <input
                                                                        type="text"
                                                                        className="milestone_input_text"
                                                                        name="milestone_desc"
                                                                        value={milestone.milestone_desc}
                                                                        onChange={(e) => handleMilestoneChange(index, e)}
                                                                        placeholder="Describe your milestone, e.g., Prototype Development"
                                                                        maxLength={250}
                                                                        required
                                                                    />
                                                                </td>
                                                                <td className="milestone-details-data col-2">
                                                                    <input
                                                                        type="date"
                                                                        className="milestone_input_date milestone_datepicker"
                                                                        name="end_date"
                                                                        value={milestone.end_date || ""}
                                                                        min={today}
                                                                        onChange={(e) => handleMilestoneChange(index, e)}
                                                                        required
                                                                    />
                                                                </td>
                                                                <td className="milestone-details-data col-1">
                                                                    <img
                                                                        src={delete_icon}
                                                                        className='delete_icon'
                                                                        title='Click to delete'
                                                                        onClick={() => deleteMilestone(index)}
                                                                        alt=''
                                                                    />
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>)}

                                                {isMobileView && (<Table responsive='sm' striped bordered hover className='modal_text_body'>
                                                    {milestoneList.map((milestone, index) => (
                                                        <tbody key={`milestone_${index}`}>
                                                            {/* <div key={`milestone_${index}`}> */}
                                                                <tr>
                                                                    <td>
                                                                        Title
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            type="text"
                                                                            className="milestone_input_text"
                                                                            name="milestone_title"
                                                                            value={milestone.milestone_title || ""}
                                                                            onChange={(e) => handleMilestoneChange(index, e)}
                                                                            placeholder="Enter milestone title, e.g., Project Kickoff"
                                                                            maxLength={100}
                                                                            required
                                                                        />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        Description
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            type="text"
                                                                            className="milestone_input_text"
                                                                            name="milestone_desc"
                                                                            value={milestone.milestone_desc}
                                                                            onChange={(e) => handleMilestoneChange(index, e)}
                                                                            placeholder="Describe your milestone, e.g., Prototype Development"
                                                                            maxLength={250}
                                                                            required
                                                                        />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        End Date
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            type="date"
                                                                            className="milestone_input_date milestone_datepicker"
                                                                            name="end_date"
                                                                            value={milestone.end_date || ""}
                                                                            min={today}
                                                                            onChange={(e) => handleMilestoneChange(index, e)}
                                                                            required
                                                                        />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        Delete
                                                                    </td>
                                                                    <td>
                                                                        <img
                                                                            src={delete_icon}
                                                                            className='delete_icon'
                                                                            title='Click to delete'
                                                                            onClick={() => deleteMilestone(index)}
                                                                            alt=''
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            {/* </div> */}
                                                        </tbody>
                                                    ))}
                                                </Table>)}
                                                <Modal
                                                    size="lg"
                                                    show={triggerDetails}
                                                    onHide={closeModal}
                                                    onEscapeKeyDown={closeModal}
                                                    scrollable
                                                    aria-labelledby="milestone_details_modal"
                                                >
                                                    <Modal.Header closeButton>
                                                        <Modal.Title id="milestone_details_modal" className='modal_text_header'>
                                                            Milestone Details
                                                        </Modal.Title>
                                                    </Modal.Header>
                                                    <Modal.Body>
                                                        {detailsList && (
                                                            <>
                                                                {!isMobileView && (<Table responsive='sm' striped bordered hover className='modal_text_body'>
                                                                    <thead className='text-center'>
                                                                        <tr>
                                                                            <th>Title</th>
                                                                            <th>Description</th>
                                                                            <th>End Date</th>
                                                                            {(accessVal === 'S' || accessVal === 'SU') && !editFlag && (<th>Edit</th>)}
                                                                            {(accessVal === 'S' || accessVal === 'SU') && editFlag && (<th>Cancel</th>)}
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        <tr>
                                                                            {!editFlag && (<>
                                                                                <td className='text-center'>{detailsList.milestone_title}</td>
                                                                                <td className='text-center'>{detailsList.milestone_desc}</td>
                                                                                <td className='text-center'>{detailsList.end_date}</td>
                                                                                {(accessVal === 'S' || accessVal === 'SU') && (<td className='text-center'><img
                                                                                    src={edit_icon}
                                                                                    className='edit_icon'
                                                                                    title='Click to edit milestone'
                                                                                    onClick={() => triggerUpdate('U')}
                                                                                    alt=''
                                                                                />
                                                                                    &nbsp;&nbsp;
                                                                                    {detailsList.is_completed === 'N' && (<img
                                                                                        src={complete_icon}
                                                                                        className='complete_icon'
                                                                                        title='Mark Milestone Met'
                                                                                        onClick={completeMilestone}
                                                                                        alt=''
                                                                                    />)}
                                                                                    &nbsp;&nbsp;
                                                                                    {detailsList.is_completed === 'Y' && (<img
                                                                                        src={resume_icon}
                                                                                        className='complete_icon'
                                                                                        title='Resume Milestone'
                                                                                        onClick={resumeMilestone}
                                                                                        alt=''
                                                                                    />)}
                                                                                </td>)}
                                                                            </>)}
                                                                            {editFlag && (<>
                                                                                <td>
                                                                                    <input
                                                                                        type="text"
                                                                                        className="milestone_input_text"
                                                                                        name="milestone_title"
                                                                                        value={detailsList.milestone_title || ""}
                                                                                        onChange={(e) => handleUpdateMilestoneChange(e)}
                                                                                        placeholder="Enter milestone title, e.g., Project Kickoff"
                                                                                        maxLength={100}
                                                                                        required
                                                                                    />
                                                                                </td>
                                                                                <td>
                                                                                    <input
                                                                                        type="text"
                                                                                        className="milestone_input_text"
                                                                                        name="milestone_desc"
                                                                                        value={detailsList.milestone_desc}
                                                                                        onChange={(e) => handleUpdateMilestoneChange(e)}
                                                                                        placeholder="Describe your milestone, e.g., Prototype Development"
                                                                                        maxLength={250}
                                                                                        required
                                                                                    />
                                                                                </td>
                                                                                <td>
                                                                                    <input
                                                                                        type="date"
                                                                                        className="milestone_input_date milestone_datepicker"
                                                                                        name="end_date"
                                                                                        value={detailsList.end_date || ""}
                                                                                        min={today}
                                                                                        onChange={(e) => handleUpdateMilestoneChange(e)}
                                                                                        required
                                                                                    />
                                                                                </td>
                                                                                {(accessVal === 'S' || accessVal === 'SU') && <td className='text-center'><img
                                                                                    src={cancel_icon}
                                                                                    className='cancel_icon'
                                                                                    title='Click to cancel'
                                                                                    onClick={() => triggerUpdate('C')}
                                                                                    alt=''
                                                                                /></td>}
                                                                            </>)}
                                                                        </tr>
                                                                    </tbody>
                                                                </Table>)}

                                                                {isMobileView && (<Table responsive='sm' striped bordered hover className='modal_text_body'>
                                                                    <tbody>
                                                                        <tr>
                                                                            <td>Title</td>
                                                                            {!editFlag && (<td>{detailsList.milestone_title}</td>)}
                                                                            {editFlag && (<td>
                                                                                <input
                                                                                    type="text"
                                                                                    className="milestone_input_text"
                                                                                    name="milestone_title"
                                                                                    value={detailsList.milestone_title || ""}
                                                                                    onChange={(e) => handleUpdateMilestoneChange(e)}
                                                                                    placeholder="Enter milestone title, e.g., Project Kickoff"
                                                                                    maxLength={100}
                                                                                    required
                                                                                />
                                                                            </td>)}
                                                                        </tr>

                                                                        <tr>
                                                                            <td>Description</td>
                                                                            {!editFlag && (<td>{detailsList.milestone_desc}</td>)}
                                                                            {editFlag && (<td>
                                                                                <input
                                                                                    type="text"
                                                                                    className="milestone_input_text"
                                                                                    name="milestone_desc"
                                                                                    value={detailsList.milestone_desc}
                                                                                    onChange={(e) => handleUpdateMilestoneChange(e)}
                                                                                    placeholder="Describe your milestone, e.g., Prototype Development"
                                                                                    maxLength={250}
                                                                                    required
                                                                                />
                                                                            </td>)}
                                                                        </tr>

                                                                        <tr>
                                                                            <td>End Date</td>
                                                                            {!editFlag && (<td>{detailsList.end_date}</td>)}
                                                                            {editFlag && (<td>
                                                                                <input
                                                                                    type="date"
                                                                                    className="milestone_input_date milestone_datepicker"
                                                                                    name="end_date"
                                                                                    value={detailsList.end_date || ""}
                                                                                    min={today}
                                                                                    onChange={(e) => handleUpdateMilestoneChange(e)}
                                                                                    required
                                                                                />
                                                                            </td>)}
                                                                        </tr>

                                                                        <tr>
                                                                            {(accessVal === 'S' || accessVal === 'SU') && !editFlag && (<td>Edit</td>)}
                                                                            {(accessVal === 'S' || accessVal === 'SU') && editFlag && (<td>Cancel</td>)}
                                                                            {(accessVal === 'S' || accessVal === 'SU') && !editFlag && (<td><img
                                                                                src={edit_icon}
                                                                                className='edit_icon'
                                                                                title='Click to edit milestone'
                                                                                onClick={() => triggerUpdate('U')}
                                                                                alt=''
                                                                            />
                                                                                &nbsp;&nbsp;
                                                                                {detailsList.is_completed === 'N' && (<img
                                                                                    src={complete_icon}
                                                                                    className='complete_icon'
                                                                                    title='Click to Mark Milestone Met'
                                                                                    onClick={completeMilestone}
                                                                                    alt=''
                                                                                />)}</td>)}
                                                                            {(accessVal === 'S' || accessVal === 'SU') && editFlag && (<td><img
                                                                                src={cancel_icon}
                                                                                className='cancel_icon'
                                                                                title='Click to cancel'
                                                                                onClick={() => triggerUpdate('C')}
                                                                                alt=''
                                                                            /></td>)}
                                                                        </tr>
                                                                    </tbody>
                                                                </Table>)}
                                                            </>
                                                        )}
                                                    </Modal.Body>
                                                    <Modal.Footer>
                                                        <div className="row">
                                                            <div className="col-12 text-center">
                                                                <button className="text-center button_text button-home"
                                                                    onClick={closeModal}>Close</button>
                                                                {(accessVal === 'S' || accessVal === 'SU') && <button className="ms-3 text-center button_text button-home"
                                                                    onClick={updateMilestoneData}>Save Changes</button>}
                                                                {(accessVal === 'S' || accessVal === 'SU') && <button className="ms-3 text-center button_text button-delete"
                                                                    onClick={removeMilestone}>Delete Milestone</button>}
                                                            </div>
                                                        </div>
                                                    </Modal.Footer>
                                                </Modal>

                                                <div className="button_container text-center">
                                                    {(accessVal === 'S' || accessVal === 'SU' || accessVal === 'ST') && <button className="text-center button_text button-home"
                                                        onClick={handleAddMilestone}>Add More</button>}

                                                    {(accessVal === 'S' || accessVal === 'SU' || accessVal === 'ST') && <button className="ms-3 text-center button_text button-home"
                                                        onClick={saveMilestone}>Submit</button>}
                                                </div>
                                                <div className="message">
                                                    {errorMessage && (
                                                        <div className="error-message">{errorMessage}</div>
                                                    )}
                                                    {successMessage && (
                                                        <div className="success-message">{successMessage}</div>
                                                    )}
                                                </div>
                                            </form>
                                        </div>
                                    </div>)}
                                </div>
                            </div>
                        </div>
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

                <div className="footer-fixed">
                    <FooterComponent />
                </div>
            </div>
        </>
    )
};

export default ProgressTrackerComponent;
