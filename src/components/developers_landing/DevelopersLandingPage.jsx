import React, { useState, useEffect } from "react";
import styles from "./DevelopersLandingPage.module.css";
import {Header} from "./Header";
import { SearchBar } from "./SearchBar";
import {OngoingProjects} from "./OngoingProjects";
import { useLocation } from "react-router-dom";

const DevelopersLandingPage = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const location = useLocation();
  void filteredProjects;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const developerId = params.get("developerId");

    if (developerId) {
      localStorage.setItem("developer_id", developerId);
      console.log("Stored developer_id:", developerId);
    } else {
      console.warn("No developer_id found in query");
    }
  }, [location]);

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