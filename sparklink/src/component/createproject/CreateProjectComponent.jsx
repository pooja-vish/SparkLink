import React, { useState, useRef } from "react";
import "./CreateProjectComponent.css";
import MenuComponent from "../../component/menu/MenuComponent";
import MasterComponent from "../MasterComponent";
import DatePicker from "react-datepicker";

const CreateProjectComponent = () => {
    const dateInputRef = useRef(null);

    const triggerDatePicker = () => {
        if(dateInputRef.current) {
            dateInputRef.current.showPicker();
        }
    };

  return (
    <>
      <div className="container-fluid">
        <MenuComponent></MenuComponent>
        <div className="row">
          <div className="col-1"></div>
          <div className="col-11">
            <div className="progress-tracker">
              <div className="createproject_Heading">
                <span>Tell Us About Your Project</span>
              </div>
              <div className="createproject_layout">
                {/* create project form */}
                <div className="createproject_form">
                  <form action="" method="POST">
                    <label className="form_label">
                      1. What is the name of your project?
                    </label>
                    <input type="text" name="project_name" />
                    <label className="form_label">
                      2. What is the main purpose of the product?
                    </label>
                    <div className="radio_button_container">
                      <input
                        type="checkbox"
                        name="purpose"
                        value="E-Commerce"
                      />
                      <span>E-Commerce</span>
                      <input
                        type="checkbox"
                        name="purpose"
                        value="Social Media"
                      />
                      <span>Social Media</span>
                      <input
                        type="checkbox"
                        name="purpose"
                        value="internal tool"
                      />
                      <span>internal tool</span>
                      <input type="checkbox" name="purpose" onChange="handleCheckBoxChange" value="Other" />
                      <span>Other</span>
                    </div>
                    <label className="form_label">
                      3. What type of product do you want to build?
                    </label>
                    <div className="radio_button_container ">
                      <input type="checkbox" name="product" value="Website" />
                      <span>Website</span>
                      <input
                        type="checkbox"
                        name="product"
                        value="Android App"
                      />
                      <span>Android App</span>
                      <input type="checkbox" name="product" value="IOS App" />
                      <span>IOS App</span>
                      <input
                        type="checkbox"
                        name="product"
                        value="Windows Software"
                      />
                      <span>Windows Software</span>
                      <input type="checkbox" name="product" value="Other" />
                      <span>Other</span>
                    </div>
                    <label className="form_label">
                      4. What is your estimated budget for this project?
                    </label>
                    <input type="text" name="project_budget" />
                    <label className="form_label">
                      5. Who is the intended audience or users for your project?
                    </label>
                    <input type="text" name="project_audience" />
                    <label className="form_label">
                      6. What are the main features or functionalities you want
                      to include in the project?
                    </label>
                    <input type="text" name="project_deadline" />
                    <label className="form_label">
                      7. What is the expected timeline or deadline for the
                      project completion?
                    </label>
                    <input
                      type="date"
                      ref={dateInputRef}
                      onClick={triggerDatePicker}
                      className="createproject_datepicker date"
                      name="project_deadline"
                    />

                    <button className="submit button-home" type="submit">
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateProjectComponent;
