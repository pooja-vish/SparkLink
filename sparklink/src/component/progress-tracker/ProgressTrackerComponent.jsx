import React, { useState, useRef, useEffect } from 'react';
import './ProgressTrackerComponent.css';
import MenuComponent from '../menu/MenuComponent';
import FooterComponent from '../footer/FooterComponent';
import axios from 'axios';
import Select from 'react-select';  // Import Select from react-select

const ProgressTrackerComponent = () => {
    const [projectList, setProjectList] = useState([]);
    const [originalProjectList, setOriginalProjectList] = useState([]); // New state for the original project list
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); // New state for search query
    const [suggestions, setSuggestions] = useState([]); // For showing search suggestions
    const [selectedOption, setSelectedOption] = useState(null); // Track the selected option
    //const [selectedTab, setSelectedTab] = useState('All');
    const [activeProgressIndex, setActiveProgressIndex] = useState(null);
    const progressListRef = useRef(null);

    // Function to handle tab click (All, Active, Completed)
    // const handleTabClick = (tab) => {
    //     setSelectedTab(tab);
    //     setActiveProgressIndex(null);
    // };

    // Function to handle progress card click
    const handleProgressClick = (index) => {
        setActiveProgressIndex(activeProgressIndex === index ? null : index);
    };

    // Fetch projects when the component first loads
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get('/project');
                setProjectList(response.data);
                setOriginalProjectList(response.data);  // Store the original project list
            } catch (err) {
                setError(err.message);
            }
        };

        fetchProjects();
    }, []);

    // Function to fetch search suggestions based on query
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

    // Handle input changes for the Select component
    const handleInputChange = (inputValue) => {
        setSearchQuery(inputValue);
        if (inputValue.trim()) {
            fetchSuggestions(inputValue);
        } else {
            setSuggestions([]); // Clear suggestions if input is empty
        }
    };

    // Handle selection from the dropdown
    const handleSelectChange = (selectedOption) => {
        setSelectedOption(selectedOption); // Track the selected option
        if (selectedOption) {
            setSearchQuery(selectedOption.label); // Update the search query
            // Filter project list case-insensitively
            const filteredProjects = originalProjectList.filter((item) =>
                item.project_name.toLowerCase() === selectedOption.value.toLowerCase()
            );
            setProjectList(filteredProjects); // Filter project list
        } else {
            // Clear selection
            setSearchQuery('');
            setSuggestions([]); // Clear suggestions
            setProjectList(originalProjectList); // Reset to original project list
        }
    };

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
                                        {/* Search Input using react-select */}
                                        <div className="search-container">
                                            <Select
                                                value={selectedOption}
                                                onChange={handleSelectChange}
                                                onInputChange={handleInputChange}
                                                options={suggestions}
                                                placeholder="Search projects..."
                                                isClearable
                                                className="search-select search-input"
                                            />
                                        </div>

                                        <div className="progress-background-card">
                                            {/* <div className="tabs-wrapper">
                                                <div className="tabs">
                                                    <span
                                                        className={`tab ${selectedTab === 'All' ? 'active' : ''}`}
                                                        onClick={() => handleTabClick('All')}
                                                    >
                                                        All
                                                    </span>
                                                    <span
                                                        className={`tab ${selectedTab === 'Active' ? 'active' : ''}`}
                                                        onClick={() => handleTabClick('Active')}
                                                    >
                                                        Active
                                                    </span>
                                                    <span
                                                        className={`tab ${selectedTab === 'Completed' ? 'active' : ''}`}
                                                        onClick={() => handleTabClick('Completed')}
                                                    >
                                                        Completed
                                                    </span>
                                                </div>
                                            </div> */}

                                            {/* Progress Cards Layout */}
                                            <div className="progress-card-layout">
                                                {/* <div className="arrow-container left-arrow">
                                                    <button className="scroll-button" onClick={() => scroll('left')}>&lt;</button>
                                                </div> */}

                                                <div className="progress-items" ref={progressListRef}>
                                                    {projectList.map((item, index) => (
                                                        <div key={index} className="progress-card" onClick={() => handleProgressClick(index)}>
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
                                                                <h3 className="progress-title">{item.project_name}</h3>
                                                                <div className="progress-bar-container">
                                                                    <div className="progress-bar">
                                                                        {/* <div className="progress" style={{ width: `${item.progress}%` }}></div> */}
                                                                    </div>
                                                                    {/* <span className="progress-text">{item.progress}%</span> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* <div className="arrow-container right-arrow">
                                                    <button className="scroll-button" onClick={() => scroll('right')}>&gt;</button>
                                                </div> */}
                                            </div>

                                            {activeProgressIndex !== null && (
                                                <div className="description">
                                                    <h4>{projectList[activeProgressIndex]?.proj_desc} Description</h4>
                                                    <p>This is a detailed description for the selected project.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer-fixed">
                    <FooterComponent />
                </div>
            </div>
        </>
    );
};

export default ProgressTrackerComponent;
