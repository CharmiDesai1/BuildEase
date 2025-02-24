import React from "react";
import styles from "./SuggestionPage.module.css";

export function ProjectCard({ title, type, carpetArea, status, bhk, image }) {
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
          <div className={styles.suggestionCount}>4</div>
          <button className={styles.suggestionsButton}>SUGGESTIONS</button>
          <div className={styles.commentCount}>4</div>
          <button className={styles.commentsButton}>ADDITIONAL COMMENTS</button>
        </div>
      </div>
    </article>
  );
}
