import React, { useState, useEffect } from 'react';
import './ViewProjectComponent.css';
import MenuComponent from '../menu/MenuComponent';
import FooterComponent from '../footer/FooterComponent';
import axios from 'axios';
import Select from 'react-select';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import edit_icon from '../../assets/edit_icon.png';
import cancel_icon from '../../assets/cancel_icon.png';
import complete_icon from '../../assets/complete_icon.png';

const ViewProjectComponent = () => {
    const [projectList, setProjectList] = useState([]);
    const [originalProjectList, setOriginalProjectList] = useState([]);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [loading, setLoading] = useState(false);
    const [projDetailsList, setProjDetailsList] = useState({});
    const [copyOfProjDetailsList, setCopyOfProjDetailsList] = useState({});
    const [triggerModalFlag, setTriggerModalFlag] = useState(false);
    const [triggerDetails, setTriggerDetails] = useState(false);
    const [isMobileView, setIsMobileView] = useState(false);
    const [editFlag, setEditFlag] = useState(false);
    const [projDescList, setProjDescList] = useState([]);
    const [copyOfProjDescList, setCopyOfProjDescList] = useState([]);
    const [tempProjDescList, setTempProjDescList] = useState([]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 768);
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/project');
            setProjectList(response.data);
            setOriginalProjectList(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchSuggestions = async (query) => {
        try {
            const response = await axios.get('/project/filter', {
                params: { projName: query },
            });

            const formattedSuggestions = response.data.map((suggestion) => ({
                label: suggestion.project_name,
                value: suggestion.project_name,
            }));
            setSuggestions(formattedSuggestions);
        } catch (err) {
            setError(err.message);
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

            const filteredProjects = originalProjectList.filter((item) =>
                item.project_name && selectedOption.value &&
                item.project_name.toLowerCase() === selectedOption.value.toLowerCase()
            );
            setProjectList(filteredProjects);
        } else {
            setSearchQuery('');
            setSuggestions([]);
            setProjectList(originalProjectList);
        }
    };

    const openProjectDetails = (projId) => {
        let filteredProj = null;

        for (let i = 0; i < projectList.length; i++) {
            if (projectList[i].proj_id === projId) {
                filteredProj = projectList[i];
                setProjDetailsList(filteredProj);
                setTriggerModalFlag(true);
                break;
            }
        }
    }

    useEffect(() => {
        if (projDetailsList && triggerModalFlag) {
            let splitDesc = projDetailsList.proj_desc.split(";");
            console.log("DESCRIPTION SPLIT>>>", splitDesc);
            let filterDesc = [];
            for (let i = 0; i < splitDesc.length; i++) {
                filterDesc[i] = splitDesc[i].trim().split(":");
                //console.log("FILTERED DESC>>>", splitDesc[i].trim().split(":"));
            }
            setProjDescList(filterDesc);
            console.log("DETAILS LIST>>>>>>>>", projDetailsList);
        }
    }, [projDetailsList, triggerModalFlag]);

    useEffect(() => {
        if (projDescList.length > 0) {
            setTriggerDetails(true);
        }
    }, [projDescList]);

    const closeModal = () => {
        setProjDetailsList(null);
        setTriggerDetails(false);
        setEditFlag(false);
    }

    const triggerUpdate = async (triggerKey) => {
        if (triggerKey === 'U') {
            setEditFlag(true);
            setCopyOfProjDetailsList(projDetailsList);
            setCopyOfProjDescList(projDescList);
        } else if (triggerKey === 'C') {
            setEditFlag(false);
            setProjDetailsList(copyOfProjDetailsList);
            setProjDescList(copyOfProjDescList);
        }
    }

    const UpdateProjDetails = async () => {
        setLoading(true);
        try {
            console.log("UPDATE QUERY>>>", projDetailsList);
            const response = await axios.post("/project/updateProject", {
                projDetailsList: projDetailsList
            });

            if (response.status === 200) {
                if (editFlag) {
                    setEditFlag(false);
                }
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
            fetchProjects();
        }
    }

    const handleUpdateProjDescChange = (event) => {
        const { name, value } = event.target;

        const updatedTempProjDescList = tempProjDescList.map((p) => {
            if (p[0] === name) {
                return [p[0], value];
            }
            return p;
        });

        setTempProjDescList(updatedTempProjDescList);
    };

    const handleProjDescBlur = () => {
        const trimmedProjDescList = tempProjDescList.map(p => [p[0].trim(), p[1].trim()]);
        setProjDescList(trimmedProjDescList);

        setProjDetailsList(prevDetails => {
            const updatedProjDescString = trimmedProjDescList
                .map(p => `${p[0]}: ${p[1]}`)
                .join('; ');
            return { ...prevDetails, proj_desc: updatedProjDescString };
        });
    };

    useEffect(() => {
        setTempProjDescList(projDescList);
    }, [projDescList]);

    const handleUpdateProjDetailsChange = (event) => {
        const { name, value } = event.target;

        setProjDetailsList(prevDetails => {
            return { ...prevDetails, [name]: value };
        });
    };


    useEffect(() => {
        console.log("UPDATED PROJ DESC>>>>>>>>", projDetailsList);
    }, [projDetailsList]);

    const deleteProject = async () => {
        setLoading(true);
        try {
            const response = await axios.post('/project/deleteProject', {
                projData: projDetailsList
            });

            if (response.status === 200) {
                fetchProjects();
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const completeProject = async () => {
        setLoading(true);
        try {
            const response = await axios.post('/project/completeProject', {
                projData: projDetailsList
            });

            if (response.status === 200) {
                fetchProjects();
                closeModal();
            }
        } catch (err) {
            setError(err.message);
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
                    <div className="container-fluid mb-5">
                        <MenuComponent />
                        <div className="progress_container">
                            <div className="row">
                                <div className="col-lg-1 col-md-1 col-sm-3"></div>
                                <div className="col-lg-11 col-md-11 col-sm-9">
                                    <div className="progress-tracker">
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

                                        <div className="progress-background-card">
                                            <div className="row progress-card-layout">
                                                {projectList.map((item, index) => (
                                                    <div className="col-8 col-md-4 col-sm-10 col-lg-2 px-4 progress-card mb-4 mt-3"
                                                        key={index} onClick={() => openProjectDetails(item.proj_id)}>
                                                        <div className="progress-image"
                                                            style={{
                                                                backgroundImage: item.image_url === null
                                                                    ? 'linear-gradient(to bottom right, #007BFF, #00BFFF)'
                                                                    : `url(${item.image_url})`,
                                                                backgroundSize: 'cover',
                                                                backgroundPosition: 'center'
                                                            }}
                                                            loading="lazy">
                                                        </div>
                                                        <div className="progress-content">
                                                            {/* <span className="progress-category">{item.project_name}</span> */}
                                                            {/* <span className="progress-category">Software</span> */}
                                                            <div className="progress-title">{item.project_name}</div>
                                                            <div className="progress-bar-container">
                                                                <div className="progress-bar">
                                                                    {/* <div className="progress" style={{ width: `${item.progress}%` }}></div> */}
                                                                    <div className="progress" style={{ width: `75%` }}></div>
                                                                </div>
                                                                {/* <span className="progress-text">{item.progress}%</span> */}
                                                                <span className="progress-text">75%</span>
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
                                    Project Details
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {projDetailsList && (
                                    <>
                                        <Table responsive='sm' bordered hover>
                                            <tbody>
                                                <tr>
                                                    <td colSpan={12} className='proj-details-header'>Project Name: {projDetailsList.project_name}
                                                        {projDetailsList.is_completed === 'N' && <span className='ms-1' style={{ float: 'right' }}><img
                                                            src={complete_icon}
                                                            className='complete_icon'
                                                            title='Mark Project as Complete'
                                                            onClick={completeProject}
                                                            alt=''
                                                        /></span>}
                                                        {!editFlag && <span style={{ float: 'right' }}><img src={edit_icon} className='edit_icon'
                                                            title='Click to edit Project Details' alt=""
                                                            onClick={() => triggerUpdate('U')} /></span>}
                                                        {editFlag && <span style={{ float: 'right' }}><img src={cancel_icon} className='cancel_icon'
                                                            title='Click to cancel editing' alt=''
                                                            onClick={() => triggerUpdate('C')}
                                                        /></span>}
                                                    </td>
                                                </tr>
                                                {projDescList.map((p, i) => (
                                                    <tr key={i}>
                                                        {!editFlag && <>
                                                            <td className='proj-details-sub-header'>{p[0]}</td>
                                                            <td className='proj-details-data'>{p[1]}</td>
                                                        </>}
                                                        {editFlag && <>
                                                            <td className='proj-details-sub-header'>{p[0]}</td>
                                                            <td className='proj-details-data'>
                                                                <input
                                                                    type="text"
                                                                    className="milestone_input_text"
                                                                    name={`${p[0]}`}
                                                                    value={tempProjDescList.find(item => item[0] === p[0])?.[1] || ""}
                                                                    onChange={(e) => handleUpdateProjDescChange(e)}
                                                                    onBlur={handleProjDescBlur}
                                                                    placeholder="Enter milestone title, e.g., Project Kickoff"
                                                                    maxLength={100}
                                                                    required
                                                                />
                                                            </td>
                                                        </>}
                                                    </tr>
                                                ))}
                                                <tr>
                                                    <td className='proj-details-sub-header'>End Date</td>
                                                    {!editFlag && <td className='proj-details-data'>{projDetailsList.end_date}</td>}
                                                    {editFlag && <td className='proj-details-data'>
                                                        <input
                                                            type="date"
                                                            className="milestone_input_date milestone_datepicker"
                                                            name="end_date"
                                                            value={projDetailsList.end_date || ""}
                                                            onChange={(e) => handleUpdateProjDetailsChange(e)}
                                                            required
                                                        />
                                                    </td>}
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
                                        <button className="ms-3 text-center button_text button-home"
                                            onClick={UpdateProjDetails}>Save Changes</button>
                                        <button className="ms-3 text-center button_text button-delete"
                                            onClick={deleteProject}>Delete Project</button>
                                    </div>
                                </div>
                            </Modal.Footer>
                        </Modal>
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
    );
};

export default ViewProjectComponent;
