import React from 'react';
import './FooterComponent.css';
import UWindsor_logo from '../../assets/UWindsor-footer-logo.svg';

const FooterComponent = () => {
    return (
        <>
            <div className="footer-container">
                <div className="container-fluid footer-background">
                    <div className="row mt-4">
                        <div className="col-2 px-4">
                            <img src={UWindsor_logo} alt="Logo" className='UWindsor-footer-logo' />
                        </div>
                        <div className="col-5 text-footer text-end">
                            Innovate and Transform
                            <br />
                            with UWindsor SparkLink
                        </div>
                        <div className="col-5 text-end px-5">
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