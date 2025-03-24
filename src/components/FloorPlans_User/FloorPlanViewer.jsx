"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import styles from "./FloorPlanUser.module.css";
import icon from "./Annotate.png";
import { AnnotationTool } from "./AnnotationTool"; // ✅ Import annotation tool

export const FloorPlanViewer = () => {
  const [userId, setUserId] = useState(null);
  const [propertyId, setPropertyId] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAnnotation, setShowAnnotation] = useState(false);
  const [propertyName, setPropertyName] = useState("");

  useEffect(() => {
    let storedUserId = localStorage.getItem("userId");
    const urlParams = new URLSearchParams(window.location.search);
    const googleUserId = urlParams.get("userId");

    if (googleUserId) {
      localStorage.setItem("userId", googleUserId);
      storedUserId = googleUserId;
      window.history.replaceState(null, "", "/floor-plans");
    }

    if (storedUserId) {
      setUserId(storedUserId);
      fetchPropertyId(storedUserId);
    } else {
      setLoading(false);
      setError("User ID not found.");
    }
  }, []);

  const fetchPropertyId = useCallback(async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/user-properties/${userId}`);
      if (response.data.length > 0) {
        setPropertyId(response.data[0].id);
      } else {
        setLoading(false);
        setError("No property associated with this user.");
      }
    } catch (error) {
      setError("Failed to fetch property ID.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (propertyId) {
      fetchImage(propertyId);
    }
  }, [propertyId]);

  const fetchImage = async (propertyId) => {
    try {
      const response = await fetch(`/api/floorplan/${propertyId}`);
      if (!response.ok) throw new Error("Failed to load floor plan");
      const data = await response.json();
      setImageUrl(data.imageUrl);
      setPropertyName(data.propertyName);
    } catch (err) {
      setError("Failed to load floor plan.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnnotateClick = () => {
    setShowAnnotation(true); // ✅ Show annotation tool
  };

  return (
    <section className={styles.floorPlanViewer}>
      <div className={styles.viewerControls}>
        <article className={styles.floorPlanCard}>
        <h2 className={styles.floorplanTitle}>
          Floor plan for {propertyName} {/* ✅ Dynamically fetch property name */}
        </h2>
          {!showAnnotation ? ( 
            <div className={styles.planContent}>
              <div className={styles.planDetails}>
                {imageUrl ? (
                  <img src={imageUrl} alt="Floor Plan" className={styles.planDetailImage} />
                ) : (
                  <p>Loading floor plan...</p>
                )}
                <div className={styles.iconGroup}>
                  <div
                    className={styles.iconContainer}
                    onClick={handleAnnotateClick}
                    style={{ cursor: "pointer" }}
                  >
                    <img src={icon} alt="Annotate Floor Plan" className={styles.featureIcon} />
                  </div>
                </div>
              </div>
            </div>
            ) : (
            <AnnotationTool imageUrl={imageUrl} propertyId={propertyId} />
            )}
        </article>
      </div>
    </section>
  );
};
