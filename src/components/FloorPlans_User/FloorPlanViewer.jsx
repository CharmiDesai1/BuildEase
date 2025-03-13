"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./FloorPlanUser.module.css";

export const FloorPlanViewer = () => {
  const [userId, setUserId] = useState(null);
  const [propertyId, setPropertyId] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let storedUserId = localStorage.getItem("userId");

    // Extract userId from URL (for Google login)
    const urlParams = new URLSearchParams(window.location.search);
    const googleUserId = urlParams.get("userId");

    if (googleUserId) {
      console.log("🔍 Google login detected, saving userId:", googleUserId);
      localStorage.setItem("userId", googleUserId);
      storedUserId = googleUserId;
      window.history.replaceState(null, "", "/floor-plans");
    }

    if (storedUserId) {
      console.log("✅ User ID found:", storedUserId);
      setUserId(storedUserId);
      fetchPropertyId(storedUserId);
    } else {
      console.error("❌ User ID is missing.");
      setLoading(false);
      setError("User ID not found.");
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
        setPropertyId(propertyId);
      } else {
        console.warn("⚠️ No property found for this user.");
        setLoading(false);
        setError("No property associated with this user.");
      }
    } catch (error) {
      console.error("❌ Error fetching property ID:", error);
      setError("Failed to fetch property ID.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (propertyId) {
      console.log("📡 Fetching floor plan for propertyId:", propertyId);
      fetchImage(propertyId);
    }
  }, [propertyId]);

  const fetchImage = async (propertyId) => {
    if (!propertyId) {
      console.warn("⚠️ Skipping API call: propertyId is null");
      return;
    }

    try {
      const response = await fetch(`/api/floorplan/${propertyId}`);
      if (!response.ok) throw new Error("Failed to load floor plan");
      const data = await response.json();
      setImageUrl(data.imageUrl);
    } catch (err) {
      console.error("❌ Error loading floor plan:", err);
      setError("Failed to load floor plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.floorPlanViewer}>
      <div className={styles.viewerControls}>
        <article className={styles.floorPlanCard}>
          <h2 className={styles.floorplanTitle}>
            Floor plan for Shridhar Athens
          </h2>
          <div className={styles.planContent}>
            <div className={styles.planDetails}>
            {imageUrl ? <img src={imageUrl} alt="Floor Plan" className={styles.planDetailImage} /> : <p>Loading floor plan...</p>}
              <div className={styles.iconGroup}>
                <div className={styles.iconContainer}>
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/52c10f8df7721feb637acb3680200383ac113ca5d338c34005966139acbec584?placeholderIfAbsent=true&apiKey=91e3b54116b2400fa8bdb6a04bd22a0c"
                    alt="Icon 1"
                    className={styles.featureIcon}
                  />
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/80688e20c99654461679cd7ae29efd559203262a3f0c1994dd3a8becab575964?placeholderIfAbsent=true&apiKey=91e3b54116b2400fa8bdb6a04bd22a0c"
                    alt="Icon 2"
                    className={styles.featureIcon}
                  />
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/514361d0cfb8e582b690521e324bd35662150ac7ad8c9fd9e4828a08edca9981?placeholderIfAbsent=true&apiKey=91e3b54116b2400fa8bdb6a04bd22a0c"
                    alt="Icon 3"
                    className={styles.featureIcon}
                  />
                </div>
              </div>
            </div>
          </div>
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