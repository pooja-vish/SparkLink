import React, { useState, useRef } from "react";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage"; // Firebase imports
import { storage } from "../../firebase_script"; // Your Firebase config file
import "./CreateProjectComponent.css";
import MenuComponent from "../../component/menu/MenuComponent";
import FooterComponent from "../footer/FooterComponent";

const CreateProjectComponent = () => {
  const dateInputRef = useRef(null);
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

  const triggerDatePicker = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  const handlePurposeCheckBoxChange = (e) => {
    setIsOtherPurposeChecked(e.target.checked);
    if (e.target.checked && e.target.value !== "Other") {
      setPurpose([...purpose, e.target.value]);
    } else {
      setPurpose(purpose.filter((p) => p !== e.target.value));
    }
  };

  const handleOtherPurposetextChange = (e) => {
    const text = e.target.value;
    setOtherPurposeText(text);
    if (setIsOtherPurposeChecked) {
      setPurpose((prevPurpose) => {
        // Remove any existing "other" text first, then add the new one
        const filteredPurpose = prevPurpose.filter(
          (p) => p !== otherPurposeText
        );
        return [...filteredPurpose, text];
      });
    }
  };

  const handleProductCheckBoxChange = (e) => {
    setIsOtherProductChecked(e.target.checked);
    if (e.target.checked && e.target.value !== "Other") {
      setProduct([...product, e.target.value]);
    } else {
      setProduct(product.filter((p) => p !== e.target.value));
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

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

    let imageUrl = previousImageUrl;

    if (imageFile) {
      // If an image was selected, upload it
      const uniqueImageName = `${Date.now()}_${imageFile.name}`; // Create a unique name for the image
      const imageRef = ref(storage, `images/${uniqueImageName}`);

      try {
        // If there was a previously uploaded image, delete it from Firebase Storage
        if (previousImageUrl) {
          const oldImageRef = ref(storage, previousImageUrl);
          await deleteObject(oldImageRef); // Delete previous image
          console.log("Previous image deleted:", previousImageUrl);
        }

        // Upload the new image to Firebase Storage
        const snapshot = await uploadBytes(imageRef, imageFile);
        // Get the download URL of the uploaded image
        imageUrl = await getDownloadURL(snapshot.ref);
        setPreviousImageUrl(imageUrl); // Update state to track the newly uploaded image URL
        console.log("Image uploaded successfully:", imageUrl);
      } catch (error) {
        setErrorMessage("Error uploading image: " + error.message);
      }
      // finally {
      //   setLoading(false); 
      //   return;
      // }
    }

    const form_data = {
      project_name: projectName,
      purpose: purpose.join(", "),
      product: product.join(", "),
      project_budget: projectBudget,
      project_description: projectDescription,
      features: features,
      project_deadline: projectDeadline,
      image_url: imageUrl, // Include the image URL in the form data
    };

    console.log("Form Data Submitted:", form_data);

    try {
      const response = await fetch("http://localhost:5100/project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form_data),
      });

      if (response.ok) {
        const project = await response.json();
        setSuccessMessage("Project created successfully!");
        console.log("Project created successfully:", project);
      } else {
        const errorResponse = await response.json();
        setErrorMessage(errorResponse.message || " Failed to create project " );
      }
    } catch (error) {
      setErrorMessage("Error submitting form: " + error.message);
    } finally {
      setLoading(false); // Hide loading indicator after the operation completes
    }
  };

  return (
    <>
      <div className="container-fluid">
        <MenuComponent />
        <div className="row">
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
                          onChange={(e) => {
                            if (e.target.checked) {
                              setPurpose([...purpose, e.target.value]);
                            } else {
                              setPurpose(
                                purpose.filter((p) => p !== e.target.value)
                              );
                            }
                          }}
                        />
                        <span>E-Commerce</span>
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          name="purpose"
                          value="Social Media"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setPurpose([...purpose, e.target.value]);
                            } else {
                              setPurpose(
                                purpose.filter((p) => p !== e.target.value)
                              );
                            }
                          }}
                        />
                        <span>Social Media</span>
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          name="purpose"
                          value="Internal Tool"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setPurpose([...purpose, e.target.value]);
                            } else {
                              setPurpose(
                                purpose.filter((p) => p !== e.target.value)
                              );
                            }
                          }}
                        />
                        <span>Internal Tool</span>
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          name="purpose"
                          value="Other"
                          onChange={handlePurposeCheckBoxChange}
                        />

                        <span>Other</span>
                      </div>
                      {isOtherPurposeChecked && (
                        <input
                          type="text"
                          name="other purpose"
                          placeholder="Specify your purpose"
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
                          onChange={(e) => {
                            if (e.target.checked) {
                              setProduct([...product, e.target.value]);
                            } else {
                              setProduct(
                                product.filter((p) => p !== e.target.value)
                              );
                            }
                          }}
                        />
                        <span>Website</span>
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          name="product"
                          value="Android App"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setProduct([...product, e.target.value]);
                            } else {
                              setProduct(
                                product.filter((p) => p !== e.target.value)
                              );
                            }
                          }}
                        />
                        <span>Android App</span>
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          name="product"
                          value="IOS App"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setProduct([...product, e.target.value]);
                            } else {
                              setProduct(
                                product.filter((p) => p !== e.target.value)
                              );
                            }
                          }}
                        />
                        <span>IOS App</span>
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          name="product"
                          value="Windows Software"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setProduct([...product, e.target.value]);
                            } else {
                              setProduct(
                                product.filter((p) => p !== e.target.value)
                              );
                            }
                          }}
                        />
                        <span>Windows Software</span>
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          name="product"
                          value="Other"
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
                      onChange={(e) => setProjectDeadline(e.target.value)} required
                    />

                    <label className="form_label">
                      8. Upload an image for your project:
                    </label>
                    <input
                      type="file"
                      onChange={handleImageChange} // Handle image selection
                      className="project_image"
                      accept="image/*"
                    />

                    <button className="submit button-home" type="submit">
                      Submit
                    </button>
                    <div className="message">
                      {errorMessage && (
                        <div className="error-message">{errorMessage}</div>
                      )}
                      {successMessage && (
                        <div className="success-message">{successMessage}</div>
                      )}
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
              <div className="spinner-border text-light" style={{width: "5rem", height: "5rem"}} role="status">
              </div>
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
