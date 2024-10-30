import React, { useState, useEffect } from 'react';
import './ProgressTrackerComponent.css';
import MenuComponent from '../menu/MenuComponent';
import FooterComponent from '../footer/FooterComponent';
import axios from 'axios';
import Select from 'react-select';
import delete_icon from '../../assets/delete_icon.png';

const ProgressTrackerComponent = () => {
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
    const currentDate = new Date();

    const handleAddMilestone = () => {
        setMilestoneList([...milestoneList, { proj_id: '', milestone_desc: '', milestone_title: '', end_date: '' }]);
    }

    const deleteMilestone = (index) => {
        setMilestoneList(prevList => {
            const updatedList = [...prevList];
            updatedList.splice(index, 1);
            return updatedList;
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
            const response = await axios.get('/project/filter', {
                params: { projName: query },
            });
            setProjectList(response.data);
            const formattedSuggestions = response.data.map((suggestion) => ({
                label: suggestion.project_name,
                value: suggestion.project_name,
            }));
            setSuggestions(formattedSuggestions);
        } catch (err) {
            setError(err.message);
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
                setMilestoneList([{ proj_id: '', milestone_desc: '', milestone_title: '', end_date: '' }]);
            }
        } catch (err) {
            setError(err.message);
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



    if (error) {
        return <div>Error: {error}</div>;
    }

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
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="page-container">
                <div className="content-container">
                    <div className="container-fluid mb-5">
                        <MenuComponent />
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
                                        {/* Card start */}

                                        {/* Card end */}

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

                                                            if (new Date(milestone.end_date) < currentDate && milestone.is_completed === 'N') {
                                                                backgroundColor = '#e74c3c';
                                                            } else if (milestone.is_completed === 'Y') {
                                                                backgroundColor = '#3CB371';
                                                            } else {
                                                                backgroundColor = '#f5a623';
                                                            }

                                                            return (
                                                                <div className="col-12 col-md-2 col-lg-2 mb-4 mt-3" key={index}> {/* 3 cards per row on large screens */}
                                                                    <div className="box" style={{ backgroundColor }}>
                                                                        <div className="header">
                                                                            {/* <span className="icon">{index + 1}</span>
                                                                            &nbsp; */}
                                                                            <span className='milestone_title_text'>{milestone.milestone_title}</span>
                                                                        </div>
                                                                        <span className='milestone_text'>{milestone.end_date}</span>
                                                                        <p className='milestone_text'>{milestone.milestone_desc}</p>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}

                                                {milestoneList.map((milestone, index) => (
                                                    <div key={`milestone_${index}`} className="milestone-item">
                                                        <div className="row">
                                                            <div className="col-4">
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
                                                            </div>
                                                            <div className="col-5">
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
                                                            </div>
                                                            <div className="col-3">
                                                                <div className="milestone-input-container">
                                                                    <input
                                                                        type="date"
                                                                        className="milestone_input_date milestone_datepicker"
                                                                        name="end_date"
                                                                        value={milestone.end_date || ""}
                                                                        onChange={(e) => handleMilestoneChange(index, e)}
                                                                        required
                                                                    />
                                                                    <img
                                                                        src={delete_icon}
                                                                        className='delete_icon'
                                                                        title='Click to delete'
                                                                        onClick={() => deleteMilestone(index)}
                                                                        alt=''
                                                                    />
                                                                </div>
                                                            </div>


                                                        </div>
                                                    </div>
                                                ))}

                                                <div className="button_container text-center">
                                                    <button className="text-center button_text button-home"
                                                        onClick={handleAddMilestone}>Add More</button>

                                                    <button className="ms-3 text-center button_text button-home"
                                                        onClick={saveMilestone}>Submit</button>
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
