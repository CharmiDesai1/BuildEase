import React, { useState } from "react";
import styles from "./FloorPlan.module.css";
import icon3 from "./search.png";

export function SearchBar({ projects, setFilteredProjects }) {
  const [selectedProject, setSelectedProject] = useState("");

  const handleSelection = (event) => {
    const query = event.target.value;
    setSelectedProject(query);

    if (query) {
      const filtered = projects.filter((project) =>
        project.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProjects(filtered);
    } else {
      setFilteredProjects(projects);
    }
  };

  return (
    <section className={styles.searchSection}>
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
            <option key={index} value={project.title}>
              {project.title}
            </option>
          ))}
        </select>
      </div>
      <h2 className={styles.ongoingProjects}>SUGGESTIONS</h2>
    </section>
  );
}