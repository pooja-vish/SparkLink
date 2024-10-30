import React, { useState, useRef, useEffect } from 'react';
import './ViewProjectComponent.css';
import MenuComponent from '../menu/MenuComponent';
import FooterComponent from '../footer/FooterComponent';
import axios from 'axios';
import Select from 'react-select';

const ViewProjectComponent = () => {
    const [projectList, setProjectList] = useState([]);
    const [originalProjectList, setOriginalProjectList] = useState([]);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [activeProgressIndex, setActiveProgressIndex] = useState(null);
    const progressListRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const handleProgressClick = (index) => {
        setActiveProgressIndex(activeProgressIndex === index ? null : index);
    };

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
                                            <div className="progress-card-layout">
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

                                            {activeProgressIndex !== null && (
                                                <div className="description">
                                                    <h4>{projectList[activeProgressIndex]?.project_name}</h4>
                                                    <p>{projectList[activeProgressIndex]?.proj_desc}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
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
    );
};

export default ViewProjectComponent;
