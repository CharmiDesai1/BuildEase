"use client";
import React, { useState, useEffect } from "react";
import axios from "axios"; 
import { useNavigate } from "react-router-dom"; 
import styles from "./Home.module.css";
import { Header } from "./Header";
import { PropertyCard } from "./PropertyCard"; 
import { SearchBar } from "./SearchBar";
import { ScrollToTop } from "./BackToTopButton";

function Home() { 
  const navigate = useNavigate(); 
  const [userId, setUserId] = useState(null);
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ email: "", password: "" });

  useEffect(() => {
    let storedUserId = localStorage.getItem("userId");
    const urlParams = new URLSearchParams(window.location.search);
    const googleUserId = urlParams.get("userId");
  
    if (googleUserId) {
      console.log("🔍 Google login detected, saving userId:", googleUserId);
      localStorage.setItem("userId", googleUserId);
      storedUserId = googleUserId;
      window.history.replaceState(null, "", "/home-user-page");
    }
  
    if (storedUserId) {
      console.log("✅ User ID found:", storedUserId);
      setUserId(storedUserId);
      fetchPropertyId(storedUserId);
    } else {
      console.error("❌ User ID is missing.");
      setLoading(false);
    }
  }, []);

  const fetchPropertyId = async (userId) => {
    try {
      console.log("📡 Fetching property ID for userId:", userId);
      const response = await axios.get(`http://localhost:5000/user-properties/${userId}`);
      console.log("🟢 API Response:", response.data);

      if (response.data.length > 0) {
        const propertyId = response.data[0].id;
        console.log("✅ Property ID retrieved:", propertyId);
        fetchProjects(propertyId);
      } else {
        console.warn("⚠️ No property found for this user.");
        setLoading(false);
      }
    } catch (error) {
      console.error("❌ Error fetching property ID:", error);
      setError("Failed to fetch property ID.");
      setLoading(false);
    }
  };

  const fetchProjects = async (propertyId) => {
    try {
      console.log("📡 Fetching project details for propertyId:", propertyId);
      const response = await axios.get(`http://localhost:5000/properties/${propertyId}`);
      console.log("✅ Project Data Type:", typeof response.data);
      console.log("✅ Project Data:", response.data);
      if (Array.isArray(response.data)) {
        setProjects(response.data);
        setFilteredProjects(response.data);
      } else if (response.data && typeof response.data === "object") {
        setProjects([response.data]);
        setFilteredProjects([response.data]);
      } else {
        console.error("❌ API response is invalid:", response.data);
        setProjects([]);
      }
  
      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetching projects:", error);
      setError("Failed to fetch project details.");
      setLoading(false);
    }
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/user/login-user", formData);
      console.log("✅ User Login Successful:", response.data);
      localStorage.setItem("userId", response.data.user.user_id);
      setUserId(response.data.user.user_id);
      fetchPropertyId(response.data.user.user_id);
      navigate("/home-user-page");
    } catch (error) {
      console.error("❌ User Login Failed:", error);
      alert("Invalid email or password!");
    }
  };

  return (
    <section className={styles.Home}>
      <Header />
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/e141cbda78ccd0fa8fa3f2181c4e7ef8970b4e920ffe31cf025bf59e3d86a6b1"
        className={styles.img2}
        alt="Decorative"
      />
      <SearchBar projects={projects} setFilteredProjects={setFilteredProjects} />

      {loading ? (
        <p>Loading projects...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : filteredProjects.length > 0 ? (
        filteredProjects.map((project) => (
          <PropertyCard
            key={project.id}
            id={project.id}
            userId={userId}
            name={project.project_name}
            type="Apartment"
            bedrooms={project.apartment_type}
            area={project.carpet_area}
            status={project.development_stage}
            imageSrc={project.image_url}
            possessionDate="May-2025"
          />
        ))
      ) : (
        <p>No projects found for this user.</p>
      )}

      <ScrollToTop />
    </section>
  );
}

export default Home;
