"use client";
import React, { useEffect, useState } from "react";
import styles from "./Suggestions.module.css";
import axios from "axios";

const ProjectHeader = () => {
  const [propertyId, setPropertyId] = useState(null);
  const [propertyData, setPropertyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  void propertyId;

  useEffect(() => {
    const storedPropertyId = localStorage.getItem("propertyId");
    console.log("Retrieved propertyId from localStorage:", storedPropertyId);

    const fetchProjects = async () => {
      try {
        console.log("📡 Fetching projects from: http://localhost:5000/api/projects");
        const response = await axios.get("http://localhost:5000/api/projects");
  
        if (response.data.length > 0) {
          const firstPropertyId = response.data[0].property_id;
          console.log("Property ID obtained:", firstPropertyId);
  
          setPropertyId(firstPropertyId);
          localStorage.setItem("propertyId", firstPropertyId); 
          fetchPropertyDetails(firstPropertyId);
        } else {
          setError("No projects found.");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("Failed to fetch projects.");
        setLoading(false);
      }
    };
    
    if (storedPropertyId) {
      setPropertyId(storedPropertyId);
      fetchPropertyDetails(storedPropertyId);
    } else {
      console.warn("No propertyId found in localStorage. Fetching first available project.");
      fetchProjects();
    }
  }, []);

  const fetchPropertyDetails = async (id) => {
    try {
      console.log("Fetching property details from:", `http://localhost:5000/properties/${id}`);
      const response = await axios.get(`http://localhost:5000/properties/${id}`);
      console.log("Property details received:", response.data);

      setPropertyData(response.data);
    } catch (error) {
      console.error("Error fetching property details:", error);
      setError("Failed to fetch property details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className={styles.projectHeader}>
      <div className={styles.propertyContainer}>
        <div className={styles.heroSection}>
          {loading ? (
            <p>Loading property details...</p>
          ) : error ? (
            <p className={styles.error}>{error}</p>
          ) : propertyData ? (
            <>
              <img
                src={propertyData.image_url || "https://via.placeholder.com/600x400?text=No+Image"}
                alt="Project Hero"
                className={styles.heroImage}
              />
              <section className={styles.projectInfo}>
                <div className={styles.projectDetails}>
                  <h2 className={styles.projectName}>
                    {propertyData.project_name || "No Project Found"}
                  </h2>
                  <div className={styles.specifications}>
                    <p className={styles.bhkSpec}>{propertyData.apartment_type || "N/A"}</p>
                    <p className={styles.constructionStatus}>
                      {propertyData.development_stage || "N/A"}
                    </p>
                    <p className={styles.areaSpec}>{propertyData.carpet_area || "N/A"}</p>
                  </div>
                </div>
              </section>
            </>
          ) : (
            <p>No property data available.</p>
          )}
        </div>
      </div>
    </header>
  );
};

export default ProjectHeader;