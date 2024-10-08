import React, { useState } from 'react';
import './ProgressTrackerComponent.css';
import MenuComponent from '../../component/menu/MenuComponent';
import MasterComponent from '../MasterComponent';

const ProgressTrackerComponent = () => {
    const progressItems = [
        { category: 'Software', title: 'Figma Basics', progress: 25, imageUrl: require('../../assets/lightbulb.png'), status: 'Active' },
        { category: 'UX Design', title: 'UX Research', progress: 45, imageUrl: require('../../assets/user.png'), status: 'Completed' },
        { category: 'UI Design', title: 'Mobile Design', progress: 20, imageUrl: require('../../assets/user.png'), status: 'Active' }
    ];

    const [selectedTab, setSelectedTab] = useState('All'); // Track the selected tab
    const [activeProgressIndex, setActiveProgressIndex] = useState(null); // Track active progress item

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
        setActiveProgressIndex(null); // Reset active progress item when switching tabs
    };

    const handleProgressClick = (index) => {
        setActiveProgressIndex(activeProgressIndex === index ? null : index); // Toggle active progress item
    };

    // Filter progress items based on the selected tab
    const filteredProgressItems = progressItems.filter((item) => {
        if (selectedTab === 'All') return true; // Show all items
        return item.status === selectedTab; // Show items based on their status
    });

    return (
        <>
            <div className="container-fluid">
                <MenuComponent></MenuComponent>
                <div className="row">
                    <div className="col-1"></div>
                    <div className="col-11">
                        <div className="progress-tracker">
                            {/* Search Bar */}
                            <div className="search-container">
                                <input type="text" placeholder="Search" className="search-input" />
                            </div>

                            <div className='progress_card_layout'>
                                {/* Tabs */}
                                <div className="tabs">
                                    <span className={`tab ${selectedTab === 'All' ? 'active' : ''}`} onClick={() => handleTabClick('All')}>All</span>
                                    <span className={`tab ${selectedTab === 'Active' ? 'active' : ''}`} onClick={() => handleTabClick('Active')}>Active</span>
                                    <span className={`tab ${selectedTab === 'Completed' ? 'active' : ''}`} onClick={() => handleTabClick('Completed')}>Completed</span>
                                </div>

                                {/* Progress Cards */}
                                <div className="progress-items">
                                    {filteredProgressItems.map((item, index) => (
                                        <div key={index} className="progress-card" onClick={() => handleProgressClick(index)}>
                                            <div className="progress-image"
                                                style={{
                                                    backgroundImage: `url(${item.imageUrl})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center'
                                                }}></div>
                                            <div className="progress-content">
                                                <span className="progress-category">{item.category}</span>
                                                <h3 className="progress-title">{item.title}</h3>
                                                <div className="progress-bar-container">
                                                    <div className="progress-bar">
                                                        <div className="progress" style={{ width: `${item.progress}%` }}></div>
                                                    </div>
                                                    <span className="progress-text">{item.progress}%</span> {/* Show progress percentage */}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Description Section for Active Progress Item */}
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
        </>
    );
}

export default ProgressTrackerComponent;
