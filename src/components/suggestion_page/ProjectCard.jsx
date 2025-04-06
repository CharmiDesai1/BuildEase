import React from "react";
import styles from "./SuggestionPage.module.css";
import { useNavigate } from "react-router-dom";

export function ProjectCard({ title, type, carpetArea, status, bhk, image, propertyId }) {
  const navigate = useNavigate();

  const handleSuggestionClick = () => {
    console.log("Button clicked for propertyId:", propertyId);
  
    if (propertyId) {
      localStorage.setItem("propertyId", propertyId);
      console.log("Stored propertyId in localStorage:", propertyId);
    } else {
      console.warn("propertyId is missing!");
    }
  
    navigate("/approve-page");
  };  

  return (
    <article className={styles.projectCard}>
      <div className={styles.projectContent}>
        <div className={styles.projectInfo}>
          {image && (
            <div className={styles.imageColumn}>
              <img
                loading="lazy"
                src={image}
                alt={title}
                className={styles.projectImage}
              />
            </div>
          )}
          <div className={styles.detailsColumn}>
            <h2 className={styles.projectTitle}>{title}</h2>
            <div className={styles.projectDetails}>
              <div className={styles.propertyType}>
                <p>{type}</p>
                <p className={styles.carpetArea}>Carpet Area</p>
              </div>
              <div className={styles.propertySpecs}>
                <p className={styles.bhk}>{bhk}</p>
                <p className={styles.area}>{carpetArea}</p>
                <p className={styles.status}>{status}</p>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.actionsColumn}>
          <button className={styles.suggestionsButton} onClick={handleSuggestionClick}>
            SUGGESTIONS
          </button>
        </div>
      </div>
    </article>
  );
}