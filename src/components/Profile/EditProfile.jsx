"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./EditProfile.module.css";

const EditProfile = () => {
  const navigate = useNavigate();
  const [developerId, setDeveloperId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const storedDeveloperId = localStorage.getItem("developerId");

    if (!storedDeveloperId) {
      console.error("Developer ID not found in localStorage. Redirecting to login.");
      return;
    }

    console.log("Developer ID retrieved in EditProfile:", storedDeveloperId);
    setDeveloperId(storedDeveloperId);
    axios
      .get(`http://localhost:5000/api/developers/${storedDeveloperId}`)
      .then((response) => {
        setFormData({
          name: response.data.full_name || "",
          email: response.data.email || "",
          phone: response.data.mobile_number || "",
        });
      })
      .catch((error) => {
        console.error("Error fetching developer details:", error);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!developerId) {
      console.error("Cannot update profile: Developer ID is missing.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/developers/update", {
        developerid: parseInt(developerId),
        name: formData.name.trim() !== "" ? formData.name : null,
        email: formData.email.trim() !== "" ? formData.email : null,
        phone: formData.phone.trim() !== "" ? formData.phone : null,
      });

      console.log("Profile updated:", response.data);
      navigate("/developers-landing-page");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className={styles.editprofile}>
      <div className={styles.editProfileContainer}>
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />

          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />

          <label>Phone Number:</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} />

          <button type="submit" className={styles.saveButton}>Save Changes</button>
        </form>

        <button 
          className={styles.forgotPasswordButton} 
          onClick={() => navigate("/forgot-password-developer")}
        >
          Forgot Password?
        </button>
      </div>
    </div>
  );
};

export default EditProfile;