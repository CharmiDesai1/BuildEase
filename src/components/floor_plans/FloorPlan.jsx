"use client";
import React, { useState, useEffect } from "react";
import styles from "./FloorPlan.module.css";
import { Header } from "./Header"; 
import { ProjectCard } from "./PropertyCard";
import { SearchBar } from "./SearchBar";
import { ScrollToTop } from "./BackToTopButton";

function FloorPlan() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/projects")
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error("Error fetching projects:", error));
  }, []);

  return (
    <section className={styles.floorPlan}>
      <Header />
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/e141cbda78ccd0fa8fa3f2181c4e7ef8970b4e920ffe31cf025bf59e3d86a6b1?placeholderIfAbsent=true&apiKey=159365e216d040bfb41dcf7dfa9bbf0b"
        className={styles.img2}
        alt="Decorative"
      />
      <SearchBar projects={projects} setFilteredProjects={setFilteredProjects} />

        <ProjectCard
          id="1"
          name="A Shridhar Vandemataram"
          type="Apartment"
          bedrooms="3Bhk"
          area="1,000 - 1,065 sq ft"
          status="Early Developement Stage"
          rating="2"
          imageSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/4404b530a70d7b7537b55b0c6f4b63affff472b64b247b17b10d6e9b24f09892?placeholderIfAbsent=true&apiKey=159365e216d040bfb41dcf7dfa9bbf0b"
          viewIconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/d54f3368dae0400de6f1befb0639876e785a3974aa38d72c2f2a06ad54187edc?placeholderIfAbsent=true&apiKey=159365e216d040bfb41dcf7dfa9bbf0b"
          downloadIconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/bc22fab4541894f07a13efa3836141db5ebb36ed2f86eb6aa0c89bafe636e3ea?placeholderIfAbsent=true&apiKey=159365e216d040bfb41dcf7dfa9bbf0b"
          hasViewAnnotated={true}
        />

        <ProjectCard
          id="2"
          name="A Shridhar Kaveri-sangam"
          type="Apartment"
          bedrooms="3Bhk"
          area="1,000 - 1,065 sq ft"
          status="Early Development stage"
          rating="3"
          imageSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/4404b530a70d7b7537b55b0c6f4b63affff472b64b247b17b10d6e9b24f09892?placeholderIfAbsent=true&apiKey=159365e216d040bfb41dcf7dfa9bbf0b"
          viewIconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/f14bea97b59db5f62c258cb9a6a40c3a30488fe03dde2ede4d46e0fbe076bef7?placeholderIfAbsent=true&apiKey=159365e216d040bfb41dcf7dfa9bbf0b"
          downloadIconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/bc22fab4541894f07a13efa3836141db5ebb36ed2f86eb6aa0c89bafe636e3ea?placeholderIfAbsent=true&apiKey=159365e216d040bfb41dcf7dfa9bbf0b"
          hasViewAnnotated={true}
        />

        <div className={styles.lastPropertyContainer}>
          <ProjectCard
            id="3"
            name="A Shridhar Anantara"
            type="Apartment"
            bedrooms="3Bhk"
            area="1,000 - 1,065 sq ft"
            status="Early Development stage"
            rating="4"
            imageSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/3462ba5cd0a20758226318a7cf6a85ecf9eafbf12df01c9c19522b5ac132bbbf?placeholderIfAbsent=true&apiKey=159365e216d040bfb41dcf7dfa9bbf0b"
            viewIconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/bb9fcf99e1fb0617698dd60ae9caceee793d704a1c5b3199a4ff8b62a97e6f94?placeholderIfAbsent=true&apiKey=159365e216d040bfb41dcf7dfa9bbf0b"
            downloadIconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/bc22fab4541894f07a13efa3836141db5ebb36ed2f86eb6aa0c89bafe636e3ea?placeholderIfAbsent=true&apiKey=159365e216d040bfb41dcf7dfa9bbf0b"
            hasViewAnnotated={true}
            isLastCard={true}
          />
          <ScrollToTop />
        </div>
    </section>
  );
}

export default FloorPlan;
