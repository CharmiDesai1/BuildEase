import React, { useState } from "react";
import styles from "./DevelopersLandingPage.module.css";
import icon3 from "./search.png";

export function SearchBar({ projects, setFilteredProjects }) {
  const [selectedProject, setSelectedProject] = useState("");

  const handleSelection = (event) => {
    const query = event.target.value;
    setSelectedProject(query);

    if (query) {
      const filtered = projects.filter((project) =>
        project.project_name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProjects(filtered);
    } else {
      setFilteredProjects(projects);
    }
  };

  return (
    <section className={styles.searchSection}>
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/e141cbda78ccd0fa8fa3f2181c4e7ef8970b4e920ffe31cf025bf59e3d86a6b1"
        className={styles.img2}
        alt="Decorative"
      />
      <div className={styles.searchContainer}>
        <div className={styles.iconWrapper2}>
          <img src={icon3} alt="Search" className={styles.searchIcon} />
        </div>
        <select
          className={styles.searchOngoingProject}
          value={selectedProject}
          onChange={handleSelection}
        >
          <option value="">Select a project</option>
          {projects.map((project, index) => (
            <option key={index} value={project.project_name}>
              {project.project_name}
            </option>
          ))}
        </select>
      </div>
      <h2 className={styles.ongoingProjects}>ONGOING PROJECTS</h2>
    </section>
  );
}