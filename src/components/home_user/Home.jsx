"use client";
import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";
import { Header } from "./Header"; 
import { PropertyCard } from "./PropertyCard";  // Correct import
import { SearchBar } from "./SearchBar";
import { ScrollToTop } from "./BackToTopButton";

function Home({ userId }) {  // Accept userId as a prop
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:5000/user-properties/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("✅ User Properties fetched:", data);
        setProjects(data);
        setFilteredProjects(data);
      })
      .catch((error) => console.error("❌ Error fetching user properties:", error));
  }, [userId]);

  return (
    <section className={styles.Home}>
      <Header />
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/e141cbda78ccd0fa8fa3f2181c4e7ef8970b4e920ffe31cf025bf59e3d86a6b1"
        className={styles.img2}
        alt="Decorative"
      />
      <SearchBar projects={projects} setFilteredProjects={setFilteredProjects} />

      {filteredProjects.length > 0 ? (
        filteredProjects.map((project) => (
          <PropertyCard  // Corrected component name
            key={project.id}
            id={project.id}
            userId={userId}
            name={project.project_name}
            type="Apartment"
            bedrooms={project.apartment_type}
            area={project.carpet_area}
            status={project.development_stage}
            imageSrc={project.image_url}
            possessionDate="May-2025"
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
