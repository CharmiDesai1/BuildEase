import React, { useState } from "react";
import styles from "./Home.module.css";
import icon3 from "./search.png";

export function SearchBar({ projects = [], setFilteredProjects }) {
  const [selectedProject, setSelectedProject] = useState("");

  // 🔍 Ensure `projects` is always an array
  if (!Array.isArray(projects)) {
    console.error("❌ Error: projects is not an array", projects);
    return <p className={styles.error}>Error loading projects.</p>;
  }

  const handleSelection = (event) => {
    const query = event.target.value;
    setSelectedProject(query);

    if (query === "" || query === "all") {
      setFilteredProjects(projects); // ✅ Show all projects when no search
    } else {
      const filtered = projects.filter((project) =>
        project.project_name.toLowerCase().includes(query.toLowerCase()) // ✅ Use correct key
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
          {projects.length > 0 ? (
            projects.map((project) => (
              <option key={project.id} value={project.project_name}>
                {project.project_name}
              </option>
            ))
          ) : (
            <option disabled>No projects available</option>
          )}
        </select>
      </div>
      <h2 className={styles.ongoingProjects}>YOUR PROPERTY</h2>
    </section>
  );
}
