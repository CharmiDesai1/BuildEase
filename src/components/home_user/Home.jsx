"use client";
import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";
import { Header } from "./Header"; 
import { ProjectCard } from "./PropertyCard";
import { SearchBar } from "./SearchBar";
import { ScrollToTop } from "./BackToTopButton";

function Home() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/projects")
      .then((response) => response.json())
      .then((data) => {
        console.log("✅ Projects fetched:", data); // Debugging log
        setProjects(data);
        setFilteredProjects(data);
      })
      .catch((error) => console.error("❌ Error fetching projects:", error));
  }, []);

  return (
    <section className={styles.Home}>
      <Header />
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/e141cbda78ccd0fa8fa3f2181c4e7ef8970b4e920ffe31cf025bf59e3d86a6b1?placeholderIfAbsent=true&apiKey=159365e216d040bfb41dcf7dfa9bbf0b"
        className={styles.img2}
        alt="Decorative"
      />
      <SearchBar projects={projects} setFilteredProjects={setFilteredProjects} />

      {filteredProjects.length > 0 ? (
        filteredProjects.map((project) => (
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

      <ScrollToTop />
    </section>
  );
}

export default Home;
