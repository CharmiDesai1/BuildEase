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
          <h2 className={styles.floorplanTitle}>Floor plan for Shridhar Athens</h2>

          {!showAnnotation ? ( // ✅ Show either floor plan or annotation tool
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
            <div className={styles.commentContainer}>
            <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/5b5fb50b718b7d632896c7601fcd04bb4fb5f599fda9a1e687611fe47639b965?placeholderIfAbsent=true&apiKey=91e3b54116b2400fa8bdb6a04bd22a0c"
            alt="Comment icon"
            className={styles.commentIcon}
            />
          <div className={styles.commentInput}>
            <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/c5fa0594be0fb4028ed16a53e2acea87d452e390b3c5fc3552783e0b5fb4d5a5?placeholderIfAbsent=true&apiKey=91e3b54116b2400fa8bdb6a04bd22a0c"
            alt="Input icon"
            className={styles.inputIcon}
            />
            <textarea
              placeholder="Add a comment"
              className={styles.commentTextarea}
              rows={2}
            />
          </div>
          <button className={styles.sendButton}>
            <span className={styles.sendText}>SEND</span>
          </button>
          </div>
        </article>
      </div>
    </section>
  );
};
