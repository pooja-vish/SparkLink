import React from 'react';
import './HomeComponent.css';
import MasterComponent from '../MasterComponent';
import Carousel from 'react-bootstrap/Carousel';
import lightbulb_img from '../../assets/lightbulb.png';
import profile_img from '../../assets/user.png';
import progress_img from '../../assets/progress.png';
import MenuComponent from '../menu/MenuComponent';
import FooterComponent from '../footer/FooterComponent';
import Homepage_1 from '../../assets/homescreen_1.png';
import Homepage_2 from '../../assets/homescreen_2.png';
import Homepage_3 from '../../assets/homescreen_3.png';
import caption_1 from '../../assets/Caption_1.png';
import caption_2 from '../../assets/Caption_2.png';
import caption_3 from '../../assets/Caption_3.png';
import caption_4 from '../../assets/Caption_4.png';
import caption_5 from '../../assets/Caption_5.png';
import caption_6 from '../../assets/Caption_6.png';

const HomeComponent = () => {
    return (
        <>
            <div className="page-container">
                <div className="content-container">
                    <MenuComponent></MenuComponent>
                    <MasterComponent></MasterComponent>
                    <div className="home_container">
                        <div className="container-fluid background">
                            {/* <MasterComponent></MasterComponent> */}
                            <div style={{ height: 'auto' }}>
                                <Carousel>
                                    <Carousel.Item>
                                        <div className="row">
                                            <div className="col-7 px-3 text-center">
                                                <span className='text_caption'>Real-World Experience
                                                    <br />for Students</span>
                                                <br />
                                                <span className='text_sub_caption'>Gain Hands-On Skills, Build a Portfolio,
                                                    <br /> and Earn Money by Solving IT Problems Across Campus</span>
                                            </div>
                                            <div className="col-5">
                                                <img src={Homepage_1} className='homepage_caption_img' alt="" />
                                            </div>
                                        </div>
                                    </Carousel.Item>
                                    <Carousel.Item>
                                        <div className="row">
                                            <div className="col-5 text-center">
                                                <img src={Homepage_2} className='homepage_caption_img' alt="" />
                                            </div>
                                            <div className="col-7 px-3 text-center">
                                                <span className='text_caption'>Empowering IT Solutions for Campus Needs</span>
                                                <br />
                                                <span className='text_sub_caption'>Connecting University of Windsor Departments
                                                    <br />with Talented Students to Tackle Tech Challenges</span>
                                            </div>
                                        </div>
                                    </Carousel.Item>
                                    <Carousel.Item>
                                        <div className="row mt-4">
                                            <div className="col-7 px-3 text-center">
                                                <span className='text_caption'>Simplifying Collaboration and Project Management</span>
                                                <br />
                                                <span className="text_sub_caption">
                                                    Seamlessly Match Departments with Skilled Students
                                                    <br /> to Complete Technology Projects Efficiently
                                                </span>
                                            </div>
                                            <div className="col-5">
                                                <img src={Homepage_3} className='homepage_caption_img' alt="" />
                                            </div>
                                        </div>
                                    </Carousel.Item>
                                </Carousel>
                            </div>
                        </div>

                        <div className="container-fluid">
                            <div className="row">
                                <div className="mt-5 col-lg-12 col-md-12 col-sm-12 text-center">
                                    <div className="text_tagline">
                                        Bring Your Projects to Life. Shape Your Future
                                        <br />
                                        Stay on Track, Stay Ahead
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-12 col-lg-4 text-center">
                                    <img src={caption_1} className='homepage_img' alt="" />
                                    <span className='card_subcaption px-2'>Bring your IT visions to life with UWindsor SparkLink,
                                        connecting you to top Computer Science talent</span>
                                </div>
                                <div className="col-12 col-lg-4 text-center">
                                    <img src={caption_2} className='homepage_img' alt="" />
                                    <span className="card_subcaption px-2">Collaborate with UWindsor SparkLink to deliver impactful
                                        IT solutions while enhancing your skills</span>
                                </div>
                                <div className="col-12 col-lg-4 text-center">
                                    <img src={caption_3} className='homepage_img' alt="" />
                                    <span className="card_subcaption px-2">
                                        Showcase your skills with SparkLink, gaining real-world experience
                                        and building a standout portfolio
                                    </span>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-12 text-center">
                                    <button className="text-center button_text button-card">Know More</button>
                                </div>
                            </div>

                            <div className="row mt-5">
                                <div className="col-12 col-lg-4 text-center">
                                    <img src={caption_4} className='homepage_img' alt="" />
                                    <span className='card_subcaption px-2'>Empower your growth with UWindsor SparkLink—bridging classroom
                                        knowledge and real-world IT skills</span>
                                </div>
                                <div className="col-12 col-lg-4 text-center">
                                    <img src={caption_5} className='homepage_img' alt="" />
                                    <span className="card_subcaption px-2">Track progress and milestones with UWindsor SparkLink,
                                        staying organized as you achieve impactful IT solutions</span>
                                </div>
                                <div className="col-12 col-lg-4 text-center">
                                    <img src={caption_6} className='homepage_img' alt="" />
                                    <span className="card_subcaption px-2">
                                        Transform ideas into impactful IT solutions with SparkLink,
                                        enhancing your skills and solving real-world problems
                                    </span>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-12 text-center">
                                    <button className="text-center button_text button-card">Know More</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer-fixed">
                    <FooterComponent></FooterComponent>
                </div>
            </div>


            {/* <div className="home-footer-container">
                
            </div> */}
        </>
    );
}

export default HomeComponent;