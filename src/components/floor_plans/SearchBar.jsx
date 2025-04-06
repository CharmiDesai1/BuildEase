import React, { useState } from "react";
import styles from "./FloorPlan.module.css";
import icon3 from "./search.png";

export function SearchBar({ projects, setFilteredProjects }) {
  const [selectedProject, setSelectedProject] = useState("");

  const handleSelection = (event) => {
    const query = event.target.value;
    setSelectedProject(query);

    if (query === "" || query === "all") { 
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter((project) =>
        project.project_name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProjects(filtered);
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
          <option value="all">Select a project (Show all)</option>
          {projects.map((project, index) => (
            <option key={index} value={project.project_name}>
              {project.project_name}
            </option>
          ))}
        </select>
      </div>
      <h2 className={styles.ongoingProjects}>Floor Plans</h2>
    </section>
  );
}