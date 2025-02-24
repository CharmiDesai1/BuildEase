import React from "react";
import styles from "./DevelopersLandingPage.module.css";
import { ProjectCard } from "./ProjectCard";
import icon3 from "./search.png";

export function OngoingProjects() {
  return (
    <section className={styles.ongoingProjectsSection}>
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/e141cbda78ccd0fa8fa3f2181c4e7ef8970b4e920ffe31cf025bf59e3d86a6b1?placeholderIfAbsent=true&apiKey=159365e216d040bfb41dcf7dfa9bbf0b"
        className={styles.img2}
        alt="Decorative"
      />
      <div className={styles.searchContainer}>
      <div className={styles.iconWrapper2}>
          <img src={icon3} alt="Search" className={styles.searchIcon} />
        </div>
      <input
        type="search"
        placeholder="Search ongoing project"
        className={styles.searchOngoingProject}
      />
      </div>
      <h2 className={styles.ongoingProjects}>ONGOING PROJECTS</h2>
      <div className={styles.projectsGrid}>
        <ProjectCard
          title="A Shridhar Athens"
          type="Apartment"
          carpetArea="1,000 - 1,065 sq ft"
          status="Under construction"
          image="https://cdn.builder.io/api/v1/image/assets/TEMP/cd168df9fc9d8e92caadcbfc8fc2741793ec03a9f995b843c5e0e8dd5d92ffd7?placeholderIfAbsent=true&apiKey=159365e216d040bfb41dcf7dfa9bbf0b"
        />
        <ProjectCard
          title="A Shridhar Vandemataram"
          type="Apartment"
          carpetArea="1,000 - 1,065 sq ft"
          status="Under construction"
          image="https://cdn.builder.io/api/v1/image/assets/TEMP/6d2789ad3c40ba07384f6a8e95f0be524d4db48c867c46b8e4d61ae63edb2a06?placeholderIfAbsent=true&apiKey=159365e216d040bfb41dcf7dfa9bbf0b"
        />
        <ProjectCard
          title="A Shridhar Kaveri-sangam"
          type="Apartment"
          carpetArea="1,000 - 1,065 sq ft"
          status="Early Development stage"
          image="https://cdn.builder.io/api/v1/image/assets/TEMP/9aa320ed7209fa45b53eeb4eca9d55c5ee7bc06b849f155f50626a0914c6bdfa?placeholderIfAbsent=true&apiKey=159365e216d040bfb41dcf7dfa9bbf0b"
        />
      </div>
    </section>
  );
}
