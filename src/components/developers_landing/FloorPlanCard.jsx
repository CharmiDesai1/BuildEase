import React from "react";
import styles from "./DevelopersLandingPage.module.css";

export function FloorPlanCard({ image, submitter, carpetSize, projectName }) {
  return (
    <article className={styles.floorPlanCard}>
      <div className={styles.floorPlanImageWrapper}>
        <img
          loading="lazy"
          src={image}
          className={styles.floorPlanImage}
          alt="Floor plan"
        />
        <div className={styles.floorPlanControls}>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/f541510c41f0bdd0b43038911ca95c9f2cf08bd8ff33e67af47160e586d504b1?placeholderIfAbsent=true&apiKey=159365e216d040bfb41dcf7dfa9bbf0b"
            className={styles.controlIcon}
            alt="Control"
          />
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/33caa93fb320c195280f6c89e5764778d1a2f71377a5c6fc7dbdac865d273328?placeholderIfAbsent=true&apiKey=159365e216d040bfb41dcf7dfa9bbf0b"
            className={styles.controlIcon}
            alt="Control"
          />
        </div>
      </div>
      <div className={styles.floorPlanInfo}>
        <p className={styles.submitter}>Submitted By: "{submitter}"</p>
        <p className={styles.carpetSize}>Carpet size- {carpetSize}</p>
        <div className={styles.projectInfo}>
          <h3 className={styles.projectName}>Floor Plan: "{projectName}"</h3>
          <p className={styles.unitType}>3BHK</p>
        </div>
      </div>
      <div className={styles.actionButtons}>
        <button className={styles.approveButton}>Approve</button>
        <button className={styles.rejectButton}>Reject</button>
        <button className={styles.requestChangeButton}>Request change</button>
      </div>
    </article>
  );
}
