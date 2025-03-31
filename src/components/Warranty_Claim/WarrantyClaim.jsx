import React, { useState, useEffect } from "react";
import axios from "axios";
import "./WarrantyClaim.css";

const WarrantyClaim = () => {
  const [userId, setUserId] = useState(null);
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [propertyId, setPropertyId] = useState(null);
  const [formData, setFormData] = useState({
    category: "",
    name: "",
    email: "",
    description: "",
    image: null,
    dateOfPossession: "",
    resolutionType: "",
    otherResolution: "",
  });

  // Fetch userId from localStorage on component mount
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");

    if (storedUserId) {
      console.log("✅ User ID found:", storedUserId);
      setUserId(storedUserId);
      fetchProperties(storedUserId);
    } else {
      console.error("❌ User ID not found in localStorage.");
    }
  }, []);

  // Fetch properties based on userId
  const fetchProperties = async (userId) => {
    try {
      console.log("📡 Fetching properties for userId:", userId);
      const response = await axios.get(`http://localhost:5000/user-properties/${userId}`);
      console.log("✅ Properties fetched:", response.data);
      setProperties(response.data);
    } catch (error) {
      console.error("❌ Error fetching properties:", error);
    }
  };

  // Fetch propertyId based on selected project_name
  const handlePropertyChange = async (e) => {
    const projectName = e.target.value;
    setSelectedProperty(projectName);

    if (projectName) {
      try {
        console.log("📡 Fetching propertyId for project:", projectName);
        const response = await axios.get(`http://localhost:5000/api/property-id/${projectName}`);
        console.log("✅ Property ID retrieved:", response.data);

        if (response.data.property_id) {
          setPropertyId(response.data.property_id);
        } else {
          console.warn("⚠️ No property ID found for this project.");
          setPropertyId(null);
        }
      } catch (error) {
        console.error("❌ Error fetching property ID:", error);
        setPropertyId(null);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId || !propertyId) {
      alert("User ID or Property ID is missing. Please select a property.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("user_id", userId);
    formDataToSend.append("property_id", propertyId);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("dateOfPossession", formData.dateOfPossession);
    formDataToSend.append("resolutionType", formData.resolutionType);
    formDataToSend.append("otherResolution", formData.otherResolution);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      const response = await axios.post("http://localhost:5000/api/warranty-claim", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ Warranty claim submitted:", response.data);
      alert("Warranty claim submitted successfully!");
    } catch (error) {
      console.error("❌ Error submitting warranty claim:", error);
      alert("Failed to submit warranty claim. Please try again.");
    }
  };

  return (
    <div className="form-container">
      <h2>Warranty Claim</h2>
      <form onSubmit={handleSubmit}>
        <label>Select Your Property*</label>
        <select value={selectedProperty} onChange={handlePropertyChange} required>
          <option value="">Select Property</option>
          {properties.map((property) => (
            <option key={property.id} value={property.project_name}>
              {property.project_name}
            </option>
          ))}
        </select>

        <label>Category*</label>
        <select name="category" onChange={handleChange} required>
          <option value="">Select category</option>
          <option value="Plumbing">Plumbing & Water Supply</option>
          <option value="Electronics">Electrical & Wiring Issues</option>
          <option value="Structural">Structural Issues</option>
          <option value="Furniture">Flooring & Tiles</option>
        </select>

        <label>Name*</label>
        <input type="text" name="name" onChange={handleChange} required />

        <label>Email*</label>
        <input type="email" name="email" onChange={handleChange} required />

        <label>Brief Description of Issues*</label>
        <textarea name="description" maxLength="300" onChange={handleChange} required></textarea>

        <label>Upload Supporting Image*</label>
        <input type="file" onChange={handleImageUpload} required />

        <label>Select Date of Possession*</label>
        <input type="date" name="dateOfPossession" onChange={handleChange} required />

        <label>Preferred Resolution Type*</label>
        <select name="resolutionType" onChange={handleChange} required>
          <option value="">Select resolution type</option>
          <option value="repair">Repair</option>
          <option value="replacement">Replacement</option>
          <option value="inspection">Inspection Required</option>
          <option value="others">Others</option>
        </select>

        {formData.resolutionType === "others" && (
          <>
            <label>Please Specify*</label>
            <input type="text" name="otherResolution" placeholder="Enter resolution type" onChange={handleChange} required />
          </>
        )}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default WarrantyClaim;