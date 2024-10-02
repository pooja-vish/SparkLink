import React from 'react';
import './HomeComponent.css';
import MasterComponent from '../MasterComponent';
import Carousel from 'react-bootstrap/Carousel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const HomeComponent = () => {
    return (
        <>
            <div className="container-fluid background">
                <MasterComponent></MasterComponent>
                <div className="row">
                    <div className="col-lg-12 col-md-12 text-center text_body" style={{ marginTop: 100, height: 270 }}>
                        <Carousel>
                            <Carousel.Item>
                                <div className="text_caption" style={{ textAlign: 'center', marginTop: 80 }}>
                                    <span>Empowering IT Solutions for Campus Needs</span>
                                </div>
                                <div className="text_sub_caption" style={{ textAlign: 'center' }}>
                                    <span>Connecting University of Windsor Departments with Talented Students to Tackle Tech Challenges</span>
                                </div>
                            </Carousel.Item>
                            <Carousel.Item>
                                <div className="text_caption" style={{ textAlign: 'center', marginTop: 80 }}>
                                    <span>Real-World Experience for Students</span>
                                </div>
                                <div className="text_sub_caption" style={{ textAlign: 'center' }}>
                                    Gain Hands-On Skills, Build a Portfolio, and Earn Money by Solving IT Problems Across Campus
                                </div>
                            </Carousel.Item>
                            <Carousel.Item>
                                <div className="text_caption" style={{ textAlign: 'center', marginTop: 80 }}>
                                    <span>Simplifying Collaboration and Project Management</span>
                                </div>
                                <div className="text_sub_caption" style={{ textAlign: 'center' }}>
                                    Seamlessly Match Departments with Skilled Students to Complete Technology Projects Efficiently
                                </div>
                            </Carousel.Item>
                        </Carousel>
                    </div>
                    <div className="text-center">
                        <button className="text-center button_text button-home">Know More</button>
                    </div>
                </div>
            </div>

            <div className="container-fluid background_level_2 mt-5">
                <div className="row">
                    <div className="mt-5 col-lg-12 col-md-12 text-center">
                        <div className="text_tagline">
                            Bring Your Projects to Life. Shape Your Future
                            <br />
                            Stay on Track, Stay Ahead
                        </div>
                    </div>
                </div>

                <div className="row mt-5">
                    <div className="col-lg-4 col-md-4 text-center">
                        <div className="d-flex align-items-center justify-content-center">
                            <div className="view_card">
                                <span className="card_text_caption">Bring Your Ideas to Life</span>
                                <br />
                                <br />
                                <span className="text_subtagline">
                                    Unlock the potential of your innovative concepts with UWindsor SparkLink.
                                    Our platform connects you with talented Computer Science students eager to
                                    transform your IT project visions into reality,
                                    ensuring your ideas are executed effectively and efficiently.
                                </span>
                                <br />
                                <br />
                                <button className="text-center button_text button-home">Know More</button>
                            </div>
                            {/* <div className="ms-5 line-separator"></div> */}
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-4 text-center">
                        <div className="d-flex align-items-center justify-content-center">
                            <div className="view_card">
                                <span className="card_text_caption">Showcase Your Skills and Achievements</span>
                                <br />
                                <br />
                                <span className="text_subtagline">
                                    Showcase your skills and accomplishments,
                                    gain valuable experience and build a robust portfolio that highlights
                                    your expertise, making you stand out to future employers.
                                </span>
                                <br />
                                <br />
                                <button className="text-center button_text button-home">Know More</button>
                            </div>
                            {/* <div className="ms-5 line-separator"></div> */}
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-4 text-center">
                        <div className="d-flex align-items-center justify-content-center">
                            <div className="view_card">
                                <span className="card_text_caption">Track Your Progress and Milestones</span>
                                <br />
                                <br />
                                <span className="text_subtagline">
                                    Stay organized and motivated by tracking your project's progress 
                                    and milestones on the UWindsor SparkLink platform. 
                                    Monitor your accomplishments, set goals, and celebrate achievements 
                                    as you collaborate with departments to deliver impactful IT solutions.
                                </span>
                                <br />
                                <br />
                                <button className="text-center button_text button-home">Know More</button>
                            </div>
                            {/* <div className="ms-5 line-separator"></div> */}
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}

export default HomeComponent;