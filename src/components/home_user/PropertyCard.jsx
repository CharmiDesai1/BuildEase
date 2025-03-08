import React, { useEffect, useState } from "react";
import styles from "./Home.module.css";
import viewIcon from "./view.png";
import downloadIcon from "./download.png";
import suggestionIcon from "./suggestion.png"; // Added icon for suggestion
import progressIcon from "./progress.png"; // Added icon for progress
import calendarIcon from "./calendar.png";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error("Error fetching project data:", error));
  }, []);

  return (
    <div className={styles.projectList}>
      {projects.length > 0 ? (
        projects.map((project) => (
          <ProjectCard
            key={project.id}
            id={project.id}
            name={project.project_name}
            type="Apartment"
            bedrooms={project.apartment_type}
            area={project.carpet_area}
            status={project.development_stage}
            imageSrc={project.image_url}
            hasViewAnnotated={true}
          />
        ))
      ) : (
        <p>Loading projects...</p>
      )}
    </div>
  );
};

export const ProjectCard = ({
  id,
  name,
  type,
  bedrooms,
  area,
  status,
  imageSrc,
  possessionDate = "May-2025",
  hasViewAnnotated
}) => {
  const handleDownload = () => {
    window.open(`http://localhost:5000/download/${id}`, "_blank");
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
                <p className={styles.area}>{area}</p>
                <p className={styles.status}>{status}</p>
              </div>
            </div>
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

        <div className={styles.actionsColumn}>
          {hasViewAnnotated && (
            <button className={styles.viewAnnotatedButton}>
              VIEW FLOOR PLAN
              <span className={styles.viewIconContainer}>
                <img src={viewIcon} alt="View Icon" className={styles.viewIcon} />
              </span>
            </button>
          )}
          <button className={styles.downloadButton} onClick={handleDownload}>
          DOWNLOAD BROCHURE
            <span className={styles.downloadIconContainer}>
              <img src={downloadIcon} alt="Download Icon" className={styles.downloadIcon} />
            </span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProjectList;