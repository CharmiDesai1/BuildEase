"use client";
import React, { useEffect, useState } from "react";
import styles from "./Suggestions.module.css";
import axios from "axios";

const ProjectHeader = () => {
  const [userId, setUserId] = useState(null);
  const [propertyData, setPropertyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      console.log("✅ User ID retrieved from storage:", storedUserId);
      setUserId(storedUserId);
      fetchUserProperties(storedUserId);
    } else {
      console.error("❌ User ID is missing.");
      setError("User not logged in");
      setLoading(false);
    }
  }, []);

  const fetchUserProperties = async (userId) => {
    try {
      console.log("📡 Fetching properties from:", `http://localhost:5000/user-properties/${userId}`);
      const response = await axios.get(`http://localhost:5000/user-properties/${userId}`);
      console.log("✅ Properties received:", response.data);

      if (response.data.length > 0) {
        setPropertyData(response.data[0]);
      } else {
        setError("No property found for this user.");
      }
    } catch (error) {
      console.error("❌ Error fetching user properties:", error);
      setError("Failed to fetch user properties.");
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
                    {propertyData?.project_name || "No Project Found"}
                  </h2>
                  <div className={styles.specifications}>
                    <p className={styles.bhkSpec}>{propertyData?.apartment_type || "N/A"}</p>
                    <p className={styles.constructionStatus}>
                      {propertyData?.development_stage || "N/A"}
                    </p>
                    <p className={styles.areaSpec}>{propertyData?.carpet_area || "N/A"}</p>
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