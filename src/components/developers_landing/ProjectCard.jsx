import React from "react";
import styles from "./DevelopersLandingPage.module.css";

export function ProjectCard({ title, type, carpetArea, status, image }) {
  return (
    <article className={styles.projectCard}>
      <div className={styles.projectImageWrapper}>
        <img
          loading="lazy"
          src={image}
          className={styles.projectImage}
          alt={title}
        />
      </div>
      <div className={styles.projectInfo}>
        <h3 className={styles.projectTitle}>{title}</h3>
        <div className={styles.projectDetails}>
          <div className={styles.projectLabels}>
            <p>{type}</p>
            <p>Carpet Area</p>
          </div>
          <div className={styles.projectValues}>
            <p>3BHK</p>
            <p>{carpetArea}</p>
            <p>{status}</p>
          </div>
        </div>
        <button className={styles.checkSuggestions}>Check suggestions</button>
      </div>
    </article>
  );
}
