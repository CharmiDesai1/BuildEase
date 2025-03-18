import React, { useState, useEffect } from "react";
import styles from "./SuggestionPage.module.css";
import { Header } from "./Header";
import { ProjectCard } from "./ProjectCard";
import { SearchBar } from "./SearchBar";
import { ScrollToTop } from "./ScrollToTop";

function SuggestionPage() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/projects")
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error("Error fetching projects:", error));
  }, []);

  return (
    <main className={styles.SuggestionPage}>
      <Header />
      <div>
        <SearchBar projects={projects} setFilteredProjects={setFilteredProjects} />
      </div>

      <section className={styles.projectsSection}>
        {projects.length > 0 ? (
          projects.map((project, index) => (
            <ProjectCard
            key={project.project_id || index} // Ensure a unique key
            title={project.project_name}
              type={project.type}
              carpetArea={project.carpet_area}
              status={project.development_stage}
              bhk={project.apartment_type}
              image={project.image_url}
            />
          ))
        ) : (
          <p>Loading projects...</p>
        )}
      </section>
      <ScrollToTop />
    </main>
  );
}

export default SuggestionPage;
