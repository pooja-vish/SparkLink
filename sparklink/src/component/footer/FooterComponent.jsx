import React from 'react';
import './FooterComponent.css';
import UWindsor_logo from '../../assets/UWindsor-footer-logo.svg';

const FooterComponent = () => {
    return (
        <>
            <div className="footer-container">
                <div className="container-fluid footer-background">
                    <div className="row mt-4">
                        <div className="col-lg-2 col-md-2 col-sm-12 px-4">
                            <img src={UWindsor_logo} alt="Logo" className='UWindsor-footer-logo' />
                        </div>
                        <div className="col-lg-5 col-md-5 col-sm-12 text-footer text-center">
                            Innovate and Transform
                            <br />
                            with UWindsor SparkLink
                        </div>
                        <div className="col-lg-5 col-md-5 col-sm-12 text-end px-5">
                            <div className="text-footer">Home</div>
                            <div className="text-footer mt-2">About Us</div>
                            <div className="text-footer mt-2">Contact Us</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FooterComponent;