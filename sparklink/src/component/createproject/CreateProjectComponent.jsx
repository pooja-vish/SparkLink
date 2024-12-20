import React, { useState, useRef, useEffect } from "react";
import {
  // getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage"; // Firebase imports
import { storage } from "../../firebase_script"; // Your Firebase config file
import "./CreateProjectComponent.css";
import MenuComponent from "../../component/menu/MenuComponent";
import MasterComponent from '../MasterComponent';
import FooterComponent from "../footer/FooterComponent";
import axios from "axios";
import { useAuth } from '../../AuthContext';
import { useNotification } from "../../notificationContext";
import Swal from "sweetalert2";

const CreateProjectComponent = () => {
  const dateInputRef = useRef(null);
  const { updateNotifyCount } = useNotification();
  const [isOtherPurposeChecked, setIsOtherPurposeChecked] = useState(false);
  const [isOtherProductChecked, setIsOtherProductChecked] = useState(false);
  const [otherPurposeText, setOtherPurposeText] = useState("");
  const [otherProductText, setOtherProductText] = useState("");
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  // Form states
  const [projectName, setProjectName] = useState("");
  const [purpose, setPurpose] = useState([]);
  const [product, setProduct] = useState([]);
  const [projectBudget, setProjectBudget] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [projectDeadline, setProjectDeadline] = useState("");
  const [imageFile, setImageFile] = useState(null); // State for the image file
  const [previousImageUrl, setPreviousImageUrl] = useState(""); // Store previously uploaded image URL

  // States for success and error messages
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    console.log("the user logged in is", user)
  })

  const handlePurposeCheckBoxChange = (e) => {
    const { checked, value } = e.target;
    if (checked) {
      if (value === "Other") {
        setIsOtherPurposeChecked(checked);
        return;
      }
      setPurpose([...purpose, value]);
    } else {
      if (value === "Other") {
        setIsOtherPurposeChecked(false);
        setPurpose((prevPurpose) =>
          prevPurpose.filter((p) => p !== otherPurposeText) // Remove "Other" from purpose
        );
        setOtherPurposeText("");
        return;
      }
      setPurpose(purpose.filter((p) => p !== value));
    }
  };

  const handleOtherPurposetextChange = (e) => {
    const text = e.target.value;
    setOtherPurposeText(text);
    if (setIsOtherPurposeChecked) {
      setPurpose((prevPurpose) => {
        const filteredPurpose = prevPurpose.filter(
          (p) => p !== otherPurposeText
        );
        return [...filteredPurpose, text];
      });
    }
  };

  const handleProductCheckBoxChange = (e) => {
    const { checked, value } = e.target;

    if (checked) {
      if (value === "Other") {
        setIsOtherProductChecked(true);
        return;
      }
      setProduct((prevProduct) => [...prevProduct, value]);
    } else {
      if (value === "Other") {
        setIsOtherProductChecked(false);
        setProduct((prevProduct) =>
          prevProduct.filter((p) => p !== otherProductText)
        );
        setOtherProductText("");
        return;
      }
      setProduct((prevProduct) => prevProduct.filter((p) => p !== value));
    }
  };


  const handleOtherProducttextChange = (e) => {
    const text = e.target.value;
    setOtherProductText(text);
    if (setIsOtherProductChecked) {
      setProduct((prevProduct) => {
        // Remove any existing "other" text first, then add the new one
        const filteredProduct = prevProduct.filter(
          (p) => p !== otherProductText
        );
        return [...filteredProduct, text];
      });
    }
  };

  // Handle image change
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]); // Set the selected image file
  };

  const emptyForm = () => {
    setProjectName("");
    setPurpose([]);
    setProduct([]);
    setProjectBudget("");
    setProjectDescription("");
    setFeatures("");
    setProjectDeadline("");
  };

  const imageNames = [
    "photo1",
    "photo2",
    "photo3",
    "photo4",
    "photo5",
    "photo6",
    "photo7",
    "photo8",
    "photo9",
    "photo10",
  ];

  // Function to get a random image name
  const getRandomImageName = () => {
    const randomIndex = Math.floor(Math.random() * imageNames.length);
    return randomIndex;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(false);

    if (setIsOtherPurposeChecked) {
      setPurpose((prevPurpose) => [...prevPurpose, otherPurposeText]);
      console.log("purpose --- > " + purpose);
    }

    // Basic form validation
    if (
      !projectName ||
      !purpose.length ||
      !product.length ||
      !projectBudget ||
      !projectDescription ||
      !features ||
      !projectDeadline
    ) {
      setErrorMessage("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    const form_data = {
      project_name: projectName,
      purpose: purpose.join(", "),
      product: product.join(", "),
      project_budget: projectBudget,
      project_description: projectDescription,
      features: features,
      project_deadline: projectDeadline,
      image_url: getRandomImageName(), // Include the image URL in the form data
    };

    console.log("Form Data Submitted:", form_data);

    // Check if the user role is supervisor (role 3)
    if (user.role === "3") {
      const result = await Swal.fire({
        title: "Supervise Project?",
        text: "Do you want to supervise this project?",
        icon: "question",
        showCancelButton: true,    // Show the Cancel button
        showDenyButton: true,      // Show the Deny (No) button
        confirmButtonText: "Yes",  // Text for the Confirm button
        denyButtonText: "No",      // Text for the Deny button
        cancelButtonText: "Cancel", // Text for the Cancel button
      });

      // Handle user response
      if (result.isConfirmed) {
        form_data.supervise = true; // Add supervise field to form data
        console.log("User opted to supervise the project.");
      } else if (result.isDenied) {
        form_data.supervise = false; // Add supervise = false if user clicked "No"
        console.log("User declined to supervise the project.");
      } else if (result.isDismissed) {
        console.log("User canceled or closed the modal, stopping execution.");
        return; // Stop execution if the modal was closed or canceled
      }
    }

    // Proceed with the rest of the logic


    // Proceed with loading state after SweetAlert decision
    setLoading(true);

    try {
      // Make the API request only if user confirmed to supervise or declined but not canceled
      const response = await axios.post("/project", form_data);

      if (response) {
        const project = response.data;
        Swal.fire({ title: 'Success', text: 'Project Created Successfully', icon: 'success', confirmButtonText: 'Ok' });
        //setSuccessMessage("Project created successfully!");
        updateNotifyCount();
        console.log("Project created successfully:", project);
        emptyForm(); // Reset form after successful submission
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Failed to create project',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
        //setErrorMessage("Failed to create project");
      }
    } catch (error) {
      // setErrorMessage("Error submitting form: " + error.message);
      if (error.response) {
        Swal.fire({
          title: 'Error',
          text: error.response.data.message,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: error.message,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    } finally {
      setLoading(false); // Hide loading indicator after the operation completes
    }
  };


  return (
    <>
      <div className="container-fluid">
        <MenuComponent />
        <div className="row">
          <MasterComponent />
          <div className="col-1"></div>
          <div className="col-11">
            <div className="progress-tracker">
              <div className="createproject_Heading">
                <span>Tell Us About Your Project</span>
              </div>
              <div className="createproject_layout">
                {/* Display error and success messages */}

                <div className="createproject_form">
                  <form onSubmit={handleSubmit}>
                    <label className="form_label">
                      1. What is the name of your project?
                      <span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="project_name"
                      value={projectName}
                      placeholder="e.g., My Awesome App"
                      onChange={(e) => setProjectName(e.target.value)}
                      maxLength={150}
                      required
                    />
                    <label className="form_label">
                      2. What is the main purpose of the product?
                      <span className="text-danger"> *</span>
                    </label>
                    <div className="radio_button_container">
                      <div>
                        <input
                          type="checkbox"
                          name="purpose"
                          value="E-Commerce"
                          checked={purpose.includes("E-Commerce")}
                          onChange={handlePurposeCheckBoxChange}
                        />
                        <span>E-Commerce</span>
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          name="purpose"
                          value="Social Media"
                          checked={purpose.includes("Social Media")}
                          onChange={handlePurposeCheckBoxChange}
                        />
                        <span>Social Media</span>
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          name="purpose"
                          value="Internal Tool"
                          checked={purpose.includes("Internal Tool")}
                          onChange={handlePurposeCheckBoxChange}
                        />
                        <span>Internal Tool</span>
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          name="purpose"
                          value="Other"
                          checked={isOtherPurposeChecked}
                          onChange={handlePurposeCheckBoxChange}
                        />

                        <span>Other</span>
                      </div>
                      {isOtherPurposeChecked && (
                        <input
                          type="text"
                          name="other purpose"
                          placeholder="Specify your purpose"
                          value={otherPurposeText}
                          onChange={handleOtherPurposetextChange}
                        />
                      )}
                    </div>
                    <label className="form_label">
                      3. What type of product do you want to build?
                      <span className="text-danger"> *</span>
                    </label>

                    <div className="radio_button_container ">
                      <div>
                        <input
                          type="checkbox"
                          name="product"
                          value="Website"
                          checked={product.includes("Website")}
                          onChange={handleProductCheckBoxChange}
                        />
                        <span>Website</span>
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          name="product"
                          value="Android App"
                          checked={product.includes("Android App")}
                          onChange={handleProductCheckBoxChange}
                        />
                        <span>Android App</span>
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          name="product"
                          value="IOS App"
                          checked={product.includes("IOS App")}
                          onChange={handleProductCheckBoxChange}
                        />
                        <span>IOS App</span>
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          name="product"
                          value="Windows Software"
                          checked={product.includes("Windows Software")}
                          onChange={handleProductCheckBoxChange}
                        />
                        <span>Windows Software</span>
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          name="product"
                          value="Other"
                          checked={isOtherProductChecked}
                          onChange={handleProductCheckBoxChange}
                        />
                        <span>Other</span>
                      </div>
                      {isOtherProductChecked && (
                        <input
                          type="text"
                          name="other text"
                          placeholder="Specify your product type"
                          onChange={handleOtherProducttextChange}
                        />
                      )}
                    </div>

                    <label className="form_label">
                      4. What is your estimated budget for this project (in
                      CAD)?
                      <span className="text-danger"> *</span>
                    </label>
                    <input
                      type="number"
                      name="project_budget"
                      value={projectBudget}
                      onChange={(e) => setProjectBudget(e.target.value)}
                      placeholder="e.g., 2000"
                      min="0"
                      required
                    />

                    <label className="form_label">
                      5. Please provide a brief description of your product:
                      <span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="project_Description"
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      placeholder="e.g., A social media platform for connecting local communities"
                      maxLength={250} // You can set a maximum length if needed
                      required
                    />

                    <label className="form_label">
                      6. What are the main features or functionalities you want
                      to include in the project?
                      <span className="text-danger"> *</span>
                    </label>
                    <textarea
                      name="features"
                      value={features}
                      onChange={(e) => setFeatures(e.target.value)}
                      className="form_textarea" // Add a class for styling
                      placeholder="e.g., User login, real-time chat, payment integration"
                      required
                    ></textarea>

                    <label className="form_label">
                      7. What is the expected timeline or deadline for the
                      project completion?
                      <span className="text-danger"> *</span>
                    </label>
                    <input
                      type="date"
                      name="project_deadline"
                      ref={dateInputRef}
                      value={projectDeadline}
                      className="createproject_datepicker date"
                      min={today}
                      //   onClick={triggerDatePicker}
                      onChange={(e) => setProjectDeadline(e.target.value)}
                      required
                    />


                    <div className="message">
                      {errorMessage && (
                        <div className="error-message">{errorMessage}</div>
                      )}
                      {successMessage && (
                        <div className="success-message">{successMessage}</div>
                      )}
                    </div>
                    <div className="row">
                      <div className="col-12 text-center">
                        <button className="text-center button_text button-home" type="submit">
                          Submit
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Loading overlay */}
        {loading && (
          <div className="loading-overlay d-flex justify-content-center align-items-center">
            <div className="text-center">
              <div
                className="spinner-border text-light"
                style={{ width: "5rem", height: "5rem" }}
                role="status"
              ></div>
              <div className="text-light mt-2">Processing...</div>
            </div>
          </div>
        )}
      </div>
      <div className="footer-fixed">
        <FooterComponent></FooterComponent>
      </div>
    </>
  );
};

export default CreateProjectComponent;
