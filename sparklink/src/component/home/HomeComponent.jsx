import React from 'react';
import './HomeComponent.css';
import MasterComponent from '../MasterComponent';
import Carousel from 'react-bootstrap/Carousel';
import lightbulb_img from '../../assets/lightbulb.png';
import profile_img from '../../assets/user.png';
import progress_img from '../../assets/progress.png';
import MenuComponent from '../menu/MenuComponent';
import FooterComponent from '../footer/FooterComponent';

const HomeComponent = () => {
    return (
        <>
            <div className="page-container">
                <div className="content-container">
                    <MenuComponent></MenuComponent>
                    <div className="home_container">
                        <div className="container-fluid background">
                            <MasterComponent></MasterComponent>
                            <div className="row">
                                <div className="col-lg-12 col-md-12 text-center text_body" style={{ height: 270 }}>
                                    <Carousel>
                                        <Carousel.Item>
                                            <div className="text_caption mt-5">
                                                <span>Empowering IT Solutions for Campus Needs</span>
                                            </div>
                                            <div className="text_sub_caption">
                                                <span>Connecting University of Windsor Departments with Talented Students to Tackle Tech Challenges</span>
                                            </div>
                                        </Carousel.Item>
                                        <Carousel.Item>
                                            <div className="text_caption mt-5">
                                                <span>Real-World Experience for Students</span>
                                            </div>
                                            <div className="text_sub_caption">
                                                Gain Hands-On Skills, Build a Portfolio, and Earn Money by Solving IT Problems Across Campus
                                            </div>
                                        </Carousel.Item>
                                        <Carousel.Item>
                                            <div className="text_caption mt-5">
                                                <span>Simplifying Collaboration and Project Management</span>
                                            </div>
                                            <div className="text_sub_caption">
                                                Seamlessly Match Departments with Skilled Students to Complete Technology Projects Efficiently
                                            </div>
                                        </Carousel.Item>
                                    </Carousel>
                                </div>
                                <div className="text-center mb-4 mt-4">
                                    <button className="text-center button_text button-home">Know More</button>
                                </div>
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
                                <div className="col-lg-4 col-md-4 col-sm-12">
                                    <img src={lightbulb_img} className='homepage_img' alt=''></img>
                                </div>
                                <div className="col-lg-8 col-md-8 col-sm-12 py-3">
                                    <div className="homepage_img">
                                        <div className="row mt-4">
                                            <div className="col-lg-6 col-md-6 col-sm-12 px-5">
                                                <div className='card_caption'>
                                                    Bring your Ideas to life
                                                </div>

                                                <div className='card_subcaption mt-4'>
                                                    Unlock the potential of your innovative concepts with UWindsor SparkLink.
                                                    Our platform connects you with talented Computer Science students eager to
                                                    transform your IT project visions into reality, ensuring your ideas are
                                                    executed effectively and efficiently.
                                                </div>
                                            </div>
                                            <div className="border_card col-lg-6 col-md-6 col-sm-12 px-5">
                                                <div className='card_caption mt-5 mt-lg-0 mt-md-0'>
                                                    Collaborate to Achieve More
                                                </div>

                                                <div className='card_subcaption mt-4'>
                                                    Discover the power of collaboration on UWindsor SparkLink.
                                                    By partnering with departments and fellow students,
                                                    you can deliver IT solutions that make a real difference
                                                    while enhancing your teamwork and problem-solving skills.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 mb-5 text-center">
                                            <button className="text-center button_text button-card">Know More</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-lg-8 col-md-8 col-sm-12 py-3">
                                    <div className="homepage_img">
                                        <div className="row mt-4 text-start">
                                            <div className="col-lg-6 col-md-6 px-5">
                                                <div className='card_caption'>
                                                    Showcase Your Skills and Achievements
                                                </div>

                                                <div className='card_subcaption mt-4'>
                                                    As a student, showcase your skills and accomplishments
                                                    by working on real-world projects through SparkLink.
                                                    Gain valuable experience and build a robust portfolio that
                                                    highlights your expertise, making you stand out to future employers.

                                                </div>
                                            </div>
                                            <div className="border_card col-lg-6 col-md-6 px-5">
                                                <div className='card_caption mt-5 mt-lg-0 mt-md-0'>
                                                    Empower Your Learning Journey
                                                </div>

                                                <div className='card_subcaption mt-4'>
                                                    Take control of your professional growth with UWindsor SparkLink.
                                                    Gain hands-on experience, solve real-world problems,
                                                    and bridge the gap between classroom knowledge and industry demands,
                                                    all while shaping your future in IT.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 mb-5 text-center">
                                            <button className="text-center button_text button-card">Know More</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-4 col-sm-12 order-first order-md-2">
                                    <img src={profile_img} className='homepage_img' alt=''></img>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-lg-4 col-md-4 col-sm-12">
                                    <img src={progress_img} className='homepage_img' alt=''></img>
                                </div>
                                <div className="col-lg-8 col-md-8 col-sm-12 py-3">
                                    <div className="homepage_img">
                                        <div className="row mt-4">
                                            <div className="col-lg-6 col-md-6 px-5">
                                                <div className='card_caption'>
                                                    Track Your Progress and Milestones
                                                </div>

                                                <div className='card_subcaption mt-4'>
                                                    Stay organized and motivated by tracking your project's progress and
                                                    milestones on the UWindsor SparkLink platform. Monitor your accomplishments,
                                                    set goals, and celebrate achievements as you collaborate with departments to
                                                    deliver impactful IT solutions.
                                                </div>
                                            </div>
                                            <div className="border_card col-lg-6 col-md-6 px-5">
                                                <div className='card_caption mt-5 mt-lg-0 mt-md-0'>
                                                    Transform Ideas into Impact
                                                </div>

                                                <div className='card_subcaption mt-4'>
                                                    Your technical skills have the potential to create a lasting impact.
                                                    Through SparkLink, transform ideas into effective solutions,
                                                    solving IT issues for real departments while developing your own expertise.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 mb-5 text-center">
                                            <button className="text-center button_text button-card">Know More</button>
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


            {/* <div className="home-footer-container">
                
            </div> */}
        </>
    );
}

export default HomeComponent;