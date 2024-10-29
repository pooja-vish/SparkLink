import React, { useState, useEffect } from 'react';
import './ProgressTrackerComponent.css';
import MenuComponent from '../menu/MenuComponent';
import FooterComponent from '../footer/FooterComponent';
import axios from 'axios';
import Select from 'react-select';

const ProgressTrackerComponent = () => {
    const [projectList, setProjectList] = useState([]);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [loading, setLoading] = useState(false);
    const [milestoneList, setMilestoneList] = useState([{ proj_id: '', milestone_desc: '' }]);
    const [filteredProjList, setFilteredProjList] = useState([]);
    const [milestoneData, setMilestoneData] = useState([]);
    const [proj_id, setProj_id] = useState('');
    const [fetchFlag, setFetchFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleAddMilestone = () => {
        setMilestoneList([...milestoneList, { proj_id: '', milestone_desc: '' }]);
    }

    const handleMilestoneChange = (index, event) => {
        const { value } = event.target;
        const updatedMilestones = [...milestoneList];
        if (filteredProjList.length > 0 && filteredProjList[0].proj_id) {
            updatedMilestones[index].proj_id = filteredProjList[0].proj_id;
            updatedMilestones[index].milestone_desc = value;
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

            setMilestoneList([{ proj_id: '', milestone_desc: '' }]);
            setFilteredProjList(filteredProjects); // Filter project list
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
        try {
            const response = await axios.post('/progressTracker/fetchMilestone', {
                proj_id: proj_id
            });
            setMilestoneData(response.data.milestoneData);
        } catch (err) {
            setError(err.message);
        } finally {
            setFetchFlag(false);
        }
    };

    useEffect(() => {
        if (fetchFlag) {
            fetchMilestone();
        }
    }, [fetchFlag]);

    useEffect(() => {
        console.log("FETCHED DATA>>>>>>>>>", milestoneData);
    }, [milestoneData]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    const saveMilestone = async (query) => {
        query.preventDefault();
        try {
            const response = await axios.post('/progressTracker/createMilestone', {
                milestoneList: milestoneList
            });
        } catch (err) {
            setError(err.message);
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
                                            className="search-select search-input"
                                        />
                                    </div>
                                    {filteredProjList.length > 0 && (<div className="createproject_layout">
                                        <div className="milestone_form">
                                            <form onSubmit={saveMilestone}>
                                                <label className="milestone_text">
                                                    Define your milestones
                                                    <span className="text-danger"> *</span>
                                                </label>

                                                {Array.isArray(milestoneData) && milestoneData.map((milestone, index) => (
                                                    <div className="row" key={index}>
                                                        <div className="col-12">
                                                            {milestone.milestone_desc}
                                                        </div>
                                                    </div>
                                                ))}

                                                {milestoneList.map((milestone, index) => (
                                                    <input
                                                        key={`milestone_${index}`}
                                                        type="text"
                                                        name={`milestone_${index}`}
                                                        value={milestone.milestone_desc}
                                                        onChange={(e) => handleMilestoneChange(index, e)}
                                                        placeholder="e.g., My Awesome App"
                                                        maxLength={150}
                                                        required
                                                    />
                                                ))}

                                                <div className="button_container text-center">
                                                    <button className="text-center button_text button-home"
                                                        onClick={handleAddMilestone}>Add More</button>

                                                    <button className="ms-3 text-center button_text button-home"
                                                    >Submit</button>
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
