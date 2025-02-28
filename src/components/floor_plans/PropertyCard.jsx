import React from "react";
import styles from "./FloorPlan.module.css";

export function ProjectCard({
  id,
  name,
  type,
  bedrooms,
  area,
  status,
  imageSrc,
  viewIconSrc,
  downloadIconSrc,
  hasViewAnnotated
}) {
  const handleDownload = () => {
    const pdfId = 1; // Directly setting pdfId to 1
    window.open(`http://localhost:5000/download/${pdfId}`, "_blank");
  };

  return (
    <article className={styles.projectCard}>
      <div className={styles.projectContent}>
        <div className={styles.projectInfo}>
          {imageSrc && (
            <div className={styles.imageColumn}>
              <img
                loading="lazy"
                src={imageSrc}
                alt={name}
                className={styles.projectImage}
              />
            </div>
          )}
          <div className={styles.detailsColumn}>
            <h2 className={styles.projectTitle}>{name}</h2>
            <div className={styles.projectDetails}>
              <div className={styles.propertyType}>
                <p>{type}</p>
                <p className={styles.carpetArea}>Carpet Area:</p> 
              </div>
              <div className={styles.propertySpecs}>
                <p className={styles.bhk}>{bedrooms}</p>
                <p className={styles.area}>{area}</p> {/* Carpet Area Value */}
                <p className={styles.status}>{status}</p>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.actionsColumn}>
          {hasViewAnnotated && (
            <button className={styles.viewAnnotatedButton}>
              VIEW ANNOTATED PLANS
              <span className={styles.viewIconContainer}>
                <img src={viewIconSrc} alt="View Icon" className={styles.viewIcon} />
              </span>
            </button>
          )}
          {/* Ensure the download button always uses ID = 1 */}
          <button className={styles.downloadButton} onClick={handleDownload}>
            DOWNLOAD
            <span className={styles.downloadIconContainer}>
              <img src={downloadIconSrc} alt="Download Icon" className={styles.downloadIcon} />
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}
