import React, { useEffect, useState } from "react";
import styles from "./DevelopersLandingPage.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import downloadIcon from "./download.png";
import TimeLineIcon from "./timeline.jpg";
import ViewIcon from "./view.png";

export function OngoingProjects() {
  const [developerId, setDeveloperId] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let devId = params.get("developerId") || localStorage.getItem("developerId");

    if (!devId) {
      setError("No Developer ID found.");
      setLoading(false);
      return;
    }

    setDeveloperId(devId);
    localStorage.setItem("developerId", devId);
    axios
      .get(`http://localhost:5000/api/properties/${devId}`)
      .then((response) => {
        setProjects(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching properties:", err);
        setError("Failed to fetch properties.");
        setLoading(false);
      });
  }, []);

  const filteredProjects = projects.filter((project) =>
    project.project_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className={styles.ongoingProjectsSection}>
      {loading ? (
        <p>Loading properties...</p>
      ) : error ? (
        <p className={styles.errorMessage}>{error}</p>
      ) : filteredProjects.length > 0 ? (
        <div className={styles.projectsGrid}>
          {filteredProjects.map((project) => (
            <article key={project.property_id} className={styles.projectCard}>
              <div className={styles.projectImageWrapper}>
                <img  
                  loading="lazy"
                  src={project.image_url}
                  className={styles.projectImage}
                  alt={project.project_name}
                />
              </div>
              <div className={styles.projectInfo}>
                <h3 className={styles.projectTitle}>{project.project_name}</h3>
                <div className={styles.projectDetails}>
                  <div className={styles.projectLabels}>
                    <p>Type</p>
                    <p>Carpet Area</p>
                    <p>Status</p>
                  </div>
                  <div className={styles.projectValues}>
                    <p>{project.apartment_type}</p>
                    <p>{project.carpet_area} sq. ft.</p>
                    <p>{project.development_stage}</p>
                  </div>
                </div>
                <button
                  className={styles.downloadButton}
                  onClick={() =>
                    window.open(`http://localhost:5000/brochure/${project.property_id}`, "_blank")
                  }
                >
                  VIEW BROCHURE
                  <span className={styles.downloadIconContainer}>
                    <img src={ViewIcon} alt="View Icon" className={styles.downloadIcon} />
                  </span>
                </button>
                <button
                  className={styles.downloadButton}
                  onClick={() =>
                    window.open(`http://localhost:5000/download/${project.property_id}`, "_blank")
                  }
                >
                  DOWNLOAD
                  <span className={styles.downloadIconContainer}>
                    <img src={downloadIcon} alt="Download Icon" className={styles.downloadIcon} />
                  </span>
                </button>
                <button
                  className={styles.downloadButton}
                  onClick={() => navigate(`/update-timeline-page/${project.property_id}`)}
                >
                  TIMELINE
                  <span className={styles.downloadIconContainer}>
                    <img src={TimeLineIcon} alt="TimeLine Icon" className={styles.downloadIcon} />
                  </span>
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p>No projects found.</p>
      )}
    </section>
  );
}
