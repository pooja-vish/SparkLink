import React, { useState, useRef, useEffect } from 'react';
import './ProgressTrackerComponent.css';
import MenuComponent from '../menu/MenuComponent';
import FooterComponent from '../footer/FooterComponent';
import axios from 'axios';

const ProgressTrackerComponent = () => {
    const progressItems = [
        { category: 'Software', title: 'Figma Basics', progress: 25, imageUrl: require('../../assets/lightbulb.png'), status: 'Active' },
        { category: 'UX Design', title: 'UX Research', progress: 45, imageUrl: require('../../assets/user.png'), status: 'Completed' },
        { category: 'UI Design', title: 'Mobile Design', progress: 20, imageUrl: require('../../assets/user.png'), status: 'Active' },
        { category: 'Software', title: 'Figma Basics', progress: 25, imageUrl: require('../../assets/lightbulb.png'), status: 'Active' },
        { category: 'UX Design', title: 'UX Research', progress: 45, imageUrl: require('../../assets/user.png'), status: 'Completed' },
        { category: 'UI Design', title: 'Mobile Design', progress: 20, imageUrl: require('../../assets/user.png'), status: 'Active' },
        { category: 'Software', title: 'Figma Basics', progress: 25, imageUrl: require('../../assets/lightbulb.png'), status: 'Active' },
        { category: 'UX Design', title: 'UX Research', progress: 45, imageUrl: require('../../assets/user.png'), status: 'Completed' },
        { category: 'UI Design', title: 'Mobile Design', progress: 20, imageUrl: require('../../assets/user.png'), status: 'Active' }
        // Add more items as needed
    ];

    const [projectList, setProjectList] = useState([]);
    const [error, setError] = useState(null);

    const [selectedTab, setSelectedTab] = useState('All');
    const [activeProgressIndex, setActiveProgressIndex] = useState(null);
    const progressListRef = useRef(null);

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
        setActiveProgressIndex(null);
    };

    const handleProgressClick = (index) => {
        setActiveProgressIndex(activeProgressIndex === index ? null : index);
    };

    const filteredProgressItems = progressItems.filter((item) => {
        if (selectedTab === 'All') return true;
        return item.status === selectedTab;
    });

    useEffect(() => {
        // Fetch all projects using axios
        const fetchProjects = async () => {
            try {
                const response = await axios.get('/project');  // Adjust the endpoint if necessary
                console.log("Testing>>>>>>>>" + response.data);
                setProjectList(response.data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchProjects();
    }, []); // Empty dependency array so this runs only once on mount

    if (error) {
        return <div>Error: {error}</div>;
    }

    // const scroll = (direction) => {
    //     if (progressListRef.current) {
    //         const scrollAmount = direction === 'left' ? -1000 : 1000;
    //         progressListRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    //     }
    // };

    const throttle = (func, limit) => {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    };

    // Apply throttle to scroll function
    const scroll = throttle((direction) => {
        if (progressListRef.current) {
            const scrollAmount = direction === 'left' ? -1000 : 1000;
            progressListRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    }, 1500);  // Throttling with a 300ms delay


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
                                            <input type="text" placeholder="Search" className="search-input" />
                                        </div>

                                        <div className="progress-background-card">
                                            <div className="tabs-wrapper">
                                                <div className="tabs">
                                                    <span className={`tab ${selectedTab === 'All' ? 'active' : ''}`} onClick={() => handleTabClick('All')}>All</span>
                                                    <span className={`tab ${selectedTab === 'Active' ? 'active' : ''}`} onClick={() => handleTabClick('Active')}>Active</span>
                                                    <span className={`tab ${selectedTab === 'Completed' ? 'active' : ''}`} onClick={() => handleTabClick('Completed')}>Completed</span>
                                                </div>
                                            </div>

                                            {/* Progress Cards Layout with Arrows Outside the Scrollable Area */}
                                            <div className="progress-card-layout">
                                                {/* <div className="arrow-container left-arrow">
                                                    <button className="scroll-button" onClick={() => scroll('left')}>&lt;</button>
                                                </div> */}

                                                <div className="progress-items" ref={progressListRef}>
                                                    {projectList.map((item, index) => (
                                                        <div key={index} className="progress-card" onClick={() => handleProgressClick(index)}>
                                                            {/* <div className="progress-image"
                                                                style={{
                                                                    backgroundImage: `url(${item.imageUrl})`,
                                                                    backgroundSize: 'cover',
                                                                    backgroundPosition: 'center'
                                                                }} loading="lazy">
                                                            </div> */}
                                                            <div className="progress-content">
                                                                {/* <span className="progress-category">{item.proj_desc}</span> */}
                                                                <h3 className="progress-title">{item.proj_desc}</h3>
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
                                                    <h4>{filteredProgressItems[activeProgressIndex].title} Description</h4>
                                                    <p>This is a detailed description for {filteredProgressItems[activeProgressIndex].title}.</p>
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
                    <FooterComponent></FooterComponent>
                </div>
            </div>
        </>
    );
}

export default ProgressTrackerComponent;
