import React from "react";
import styles from "./SuggestionPage.module.css";
import icon3 from "./search.png";

export function SearchBar() {
  return (
    <section className={styles.searchSection}>
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
        placeholder="Search for project suggestions"
        className={styles.searchOngoingProject}
      />
      </div>
      <h2 className={styles.ongoingProjects}>SUGGESTIONS</h2>
    </section>
  );
}
