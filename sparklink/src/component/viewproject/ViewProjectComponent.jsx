import React, { useState, useEffect } from 'react';
import './ViewProjectComponent.css';
import MenuComponent from '../menu/MenuComponent';
import FooterComponent from '../footer/FooterComponent';
import axios from 'axios';
import Select from 'react-select';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import edit_icon from '../../assets/edit_icon.png';

const ViewProjectComponent = () => {
    const [projectList, setProjectList] = useState([]);
    const [originalProjectList, setOriginalProjectList] = useState([]);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [loading, setLoading] = useState(false);
    const [projDetailsList, setProjDetailsList] = useState({});
    const [triggerModalFlag, setTriggerModalFlag] = useState(false);
    const [triggerDetails, setTriggerDetails] = useState(false);
    const [isMobileView, setIsMobileView] = useState(false);
    const [editFlag, setEditFlag] = useState(false);
    const [projDescList, setProjDescList] = useState([]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 768);
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
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
        }
    }, [projDetailsList, triggerModalFlag]);

    useEffect(() => {
        if (projDescList) {
            setTriggerDetails(true);
        }
    }, [projDescList]);

    const closeModal = () => {
        setProjDetailsList(null);
        setTriggerDetails(false);
        setEditFlag(false);
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
                                                            <span className="progress-category">Software</span>
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
                                                        <span style={{float: 'right'}}><img src={edit_icon} className='edit_icon' alt="" /></span>
                                                    </td>
                                                </tr>
                                                {projDescList.map((p, i) => (
                                                    <tr key={i}>
                                                        <td className='proj-details-sub-header'>{p[0]}</td>
                                                        <td className='proj-details-data'>{p[1]}</td>
                                                    </tr>
                                                ))}
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
                                        >Save Changes</button>
                                        <button className="ms-3 text-center button_text button-delete"
                                        >Delete Milestone</button>
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
