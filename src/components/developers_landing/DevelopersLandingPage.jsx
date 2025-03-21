import React, { useState, useEffect } from "react";
import styles from "./DevelopersLandingPage.module.css";
import {Header} from "./Header";
import { SearchBar } from "./SearchBar";
import {OngoingProjects} from "./OngoingProjects";

const DevelopersLandingPage = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/projects")
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error("Error fetching projects:", error));
  }, []);
  return (
    <main className={styles.developersLandingPage}>
      <Header />
      <SearchBar projects={projects} setFilteredProjects={setFilteredProjects} />
      <OngoingProjects />
    </main>
  );
};

export default DevelopersLandingPage;
