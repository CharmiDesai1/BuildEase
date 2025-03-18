import React from "react";
import styles from "./Home.module.css";
import viewIcon from "./view.png";
import downloadIcon from "./download.png";
import suggestionIcon from "./suggestion.png";
import progressIcon from "./progress.png"; 
import calendarIcon from "./calendar.png";
import TimeLineIcon from "./timeline.jpg";
import { useNavigate } from "react-router-dom";

export const PropertyCard = ({
  id,
  userId,
  name,
  type,
  bedrooms,
  area,
  status,
  imageSrc,
  possessionDate
}) => {
  const handleDownload = (fileType) => {
    window.open(`http://localhost:5000/download-property/${userId}/${id}/${fileType}`, "_blank");
  };
  const navigate = useNavigate();

  return (
    <article className={styles.projectCard}>
      <div className={styles.projectContent}>
        <div className={styles.projectInfo}>
          {imageSrc && (
            <div className={styles.imageColumn}>
              <img loading="lazy" src={imageSrc} alt={name} className={styles.projectImage} />
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
                <p className={styles.area}>{area}</p>
                <p className={styles.status}>{status}</p>
              </div>
            </div>
            
            <div className={styles.projectMeta}>
              <div className={styles.metaItem}>
                <img src={calendarIcon} alt="Calendar Icon" className={styles.metaIcon} />
                <span>Possession date <br /><strong>{possessionDate}</strong></span>
              </div>
              
              <div className={styles.metaItem}>
                <img src={suggestionIcon} alt="Suggestion Icon" className={styles.metaIcon} />
                <span>View suggestion</span>
              </div>

              <div className={styles.metaItem}>
                <img src={progressIcon} alt="Progress Icon" className={styles.metaIcon} />
                <span>View current progress</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.actionsColumn}>
          <button className={styles.viewAnnotatedButton} onClick={() => handleDownload("floorplan")}>
            VIEW FLOOR PLAN
            <span className={styles.viewIconContainer}>
              <img src={viewIcon} alt="View Icon" className={styles.viewIcon} />
            </span>
          </button>
          <button className={styles.downloadButton} onClick={() => handleDownload("brochure")}>
            DOWNLOAD BROCHURE
            <span className={styles.downloadIconContainer}>
              <img src={downloadIcon} alt="Download Icon" className={styles.downloadIcon} />
            </span>
          </button>
          <button className={styles.downloadButton} onClick={() => navigate("/timeline-user-page")}>
            TIMELINE
            <span className={styles.downloadIconContainer}>
              <img src={TimeLineIcon} alt="TimeLine Icon" className={styles.downloadIcon} />
            </span>
          </button>
        </div>
      </div>
    </article>
  );
};
