import React, { useState, useRef } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"; // Firebase imports
import { storage } from "../../firebase_script"; // Your Firebase config file
import "./CreateProjectComponent.css";
import MenuComponent from "../../component/menu/MenuComponent";

const CreateProjectComponent = () => {
  const dateInputRef = useRef(null);

  // Form states
  const [projectName, setProjectName] = useState("");
  const [purpose, setPurpose] = useState([]);
  const [product, setProduct] = useState([]);
  const [projectBudget, setProjectBudget] = useState("");
  const [projectAudience, setProjectAudience] = useState("");
  const [features, setFeatures] = useState("");
  const [projectDeadline, setProjectDeadline] = useState("");
  const [imageFile, setImageFile] = useState(null); // State for the image file
  const [previousImageUrl, setPreviousImageUrl] = useState(""); // Store previously uploaded image URL

  // States for success and error messages
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

    // Basic form validation
    if (!projectName || !purpose.length || !product.length || !projectBudget || !projectAudience || !features || !projectDeadline) {
      setErrorMessage("Please fill in all required fields.");
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
        return;
      }
    }

    const form_data = {
      project_name: projectName,
      purpose: purpose.join(", "),
      product: product.join(", "),
      project_budget: projectBudget,
      project_audience: projectAudience,
      features: features,
      project_deadline: projectDeadline,
      image_url: imageUrl, // Include the image URL in the form data
    };

    console.log("Form Data Submitted:", form_data);

    try {
      const response = await fetch("http://localhost:5000/project", {
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
        setErrorMessage(errorResponse.message || "Failed to create project");
      }
    } catch (error) {
      setErrorMessage("Error submitting form: " + error.message);
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
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}

                <div className="createproject_form">
                  <form onSubmit={handleSubmit}>
                    <label className="form_label">
                      1. What is the name of your project?
                    </label>
                    <input
                      type="text"
                      name="project_name"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                    />
                    
                    <label className="form_label">
                      2. What is the main purpose of the product?
                    </label>
                    <div className="radio_button_container">
                      <input
                        type="checkbox"
                        name="purpose"
                        value="E-Commerce"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPurpose([...purpose, e.target.value]);
                          } else {
                            setPurpose(purpose.filter(p => p !== e.target.value));
                          }
                        }}
                      />
                      <span>E-Commerce</span>
                      <input
                        type="checkbox"
                        name="purpose"
                        value="Social Media"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPurpose([...purpose, e.target.value]);
                          } else {
                            setPurpose(purpose.filter(p => p !== e.target.value));
                          }
                        }}
                      />
                      <span>Social Media</span>
                      <input
                        type="checkbox"
                        name="purpose"
                        value="Internal Tool"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPurpose([...purpose, e.target.value]);
                          } else {
                            setPurpose(purpose.filter(p => p !== e.target.value));
                          }
                        }}
                      />
                      <span>Internal Tool</span>
                      <input
                        type="checkbox"
                        name="purpose"
                        value="Other"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPurpose([...purpose, e.target.value]);
                          } else {
                            setPurpose(purpose.filter(p => p !== e.target.value));
                          }
                        }}
                      />
                      <span>Other</span>
                    </div>
                    
                    <label className="form_label">
                      3. What type of product do you want to build?
                    </label>
                    <div className="radio_button_container ">
                      <input
                        type="checkbox"
                        name="product"
                        value="Website"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setProduct([...product, e.target.value]);
                          } else {
                            setProduct(product.filter(p => p !== e.target.value));
                          }
                        }}
                      />
                      <span>Website</span>
                      <input
                        type="checkbox"
                        name="product"
                        value="Android App"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setProduct([...product, e.target.value]);
                          } else {
                            setProduct(product.filter(p => p !== e.target.value));
                          }
                        }}
                      />
                      <span>Android App</span>
                      <input
                        type="checkbox"
                        name="product"
                        value="IOS App"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setProduct([...product, e.target.value]);
                          } else {
                            setProduct(product.filter(p => p !== e.target.value));
                          }
                        }}
                      />
                      <span>IOS App</span>
                      <input
                        type="checkbox"
                        name="product"
                        value="Windows Software"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setProduct([...product, e.target.value]);
                          } else {
                            setProduct(product.filter(p => p !== e.target.value));
                          }
                        }}
                      />
                      <span>Windows Software</span>
                      <input
                        type="checkbox"
                        name="product"
                        value="Other"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setProduct([...product, e.target.value]);
                          } else {
                            setProduct(product.filter(p => p !== e.target.value));
                          }
                        }}
                      />
                      <span>Other</span>
                    </div>

                    <label className="form_label">
                      4. What is your estimated budget for this project?
                    </label>
                    <input
                      type="text"
                      name="project_budget"
                      value={projectBudget}
                      onChange={(e) => setProjectBudget(e.target.value)}
                    />
                    
                    <label className="form_label">
                      5. Who is the intended audience or users for your project?
                    </label>
                    <input
                      type="text"
                      name="project_audience"
                      value={projectAudience}
                      onChange={(e) => setProjectAudience(e.target.value)}
                    />

                    <label className="form_label">
                      6. What are the main features or functionalities you want to include in the project?
                    </label>
                    <textarea
                      name="features"
                      value={features}
                      onChange={(e) => setFeatures(e.target.value)}
                      className="form_textarea" // Add a class for styling
                    ></textarea>


                    <label className="form_label">
                      7. When do you expect to complete this project?
                    </label>
                    <input
                      type="date"
                      name="project_deadline"
                      ref={dateInputRef}
                      value={projectDeadline}
                      onChange={(e) => setProjectDeadline(e.target.value)}
                    />

                    <label className="form_label">
                      
                      8. Upload an image for your project:
                    </label>
                    <input
                      type="file"
                      onChange={handleImageChange} // Handle image selection
                      accept="image/*"
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
