"use client";
import React, { useState, useEffect } from "react";
import axios from "axios"; // ✅ Import Axios
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import styles from "./Home.module.css";
import { Header } from "./Header";
import { PropertyCard } from "./PropertyCard"; 
import { SearchBar } from "./SearchBar";
import { ScrollToTop } from "./BackToTopButton";

function Home() { 
  const navigate = useNavigate(); // ✅ Define navigate
  const [userId, setUserId] = useState(null);
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ email: "", password: "" });

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      console.log("✅ User ID retrieved from storage:", storedUserId);
      setUserId(storedUserId);
      fetchUserProperties(storedUserId);
    } else {
      console.error("❌ User ID is missing.");
      setLoading(false);
    }
  }, []);

  const fetchUserProperties = async (userId) => {
    try {
      console.log("📡 Fetching properties from:", `http://localhost:5000/user-properties/${userId}`);
      const response = await axios.get(`http://localhost:5000/user-properties/${userId}`);
      console.log("✅ Properties received:", response.data);

      setProjects(response.data);
      setFilteredProjects(response.data);
      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetching user properties:", error);
      setError("Failed to fetch user properties.");
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
      fetchUserProperties(response.data.user.user_id);
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
