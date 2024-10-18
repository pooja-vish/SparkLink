import React, { useState, useRef } from "react";
import "./CreateProjectComponent.css";
import MenuComponent from "../../component/menu/MenuComponent";
import MasterComponent from "../MasterComponent";

const CreateProjectComponent = () => {
  const dateInputRef = useRef(null);
  const [isOtherPurposeChecked, setIsOtherPurposeChecked] = useState(false);
  const [isOtherTypeChecked, setIsOtherTypeChecked] = useState(false);

  const triggerDatePicker = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  const handlePurposeCheckBoxChange = (e) => {
    setIsOtherPurposeChecked(e.target.checked);
  };
  const handleTypeCheckBoxChange = (e) => {
    setIsOtherTypeChecked(e.target.checked);
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
                    <input
                      type="text"
                      name="project_name"
                      placeholder="e.g., My Awesome App"
                      maxLength={10}
                    />
                    <label className="form_label">
                      2. What is the main purpose of the product?
                    </label>
                    <div className="radio_button_container">
                      <div>
                        <input
                          type="checkbox"
                          name="purpose"
                          value="E-Commerce"
                        />
                        <span>E-Commerce</span>
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          name="purpose"
                          value="Social Media"
                        />
                        <span>Social Media</span>
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          name="purpose"
                          value="internal tool"
                        />
                        <span>internal tool</span>
                      </div>

                      <div>
                        <input
                          type="checkbox"
                          name="purpose"
                          onChange={handlePurposeCheckBoxChange}
                          value="Other"
                        />
                        <span>Other</span>
                      </div>
                      {isOtherPurposeChecked && (
                        <input
                          type="text"
                          name="other text"
                          placeholder="Specify your purpose"
                        />
                      )}
                    </div>
                    <label className="form_label">
                      3. What type of product do you want to build?
                    </label>
                    <div className="radio_button_container ">
                      <div>
                        <input type="checkbox" name="product" value="Website" />
                        <span>Website</span>
                      </div>
                      <div>
                      <input
                        type="checkbox"
                        name="product"
                        value="Android App"
                      />
                      <span>Android App</span>
                      </div>
                      <div>
                      <input type="checkbox" name="product" value="IOS App" />
                      <span>IOS App</span>
                      </div>
                      <div>
                      <input
                        type="checkbox"
                        name="product"
                        value="Windows Software"
                      />
                      <span>Windows Software</span>
                      </div>
                      <div>
                      <input
                        type="checkbox"
                        name="product"
                        onChange={handleTypeCheckBoxChange}
                        value="Other"
                      />
                      <span>Other</span>
                      </div>
                      {isOtherTypeChecked && (
                        <input
                          type="text"
                          name="other text"
                          placeholder="Specify your product type"
                        />
                      )}
                    </div>
                    <label className="form_label">
                      4. What is your estimated budget for this project (in
                      CAD)?
                    </label>
                    <input
                      type="number"
                      name="project_budget"
                      placeholder="e.g., 2000"
                      min="0"
                    />
                    <label className="form_label">
                      5. Please provide a brief description of your product:
                    </label>
                    <input
                      type="text"
                      name="product_description"
                      placeholder="e.g., A social media platform for connecting local communities"
                      maxLength={250} // You can set a maximum length if needed
                    />
                    <label className="form_label">
                      6. What are the main features or functionalities you want
                      to include in the project?
                    </label>
                    <input
                      type="text"
                      name="project_deadline"
                      placeholder="e.g., User login, real-time chat, payment integration"
                    />
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
