"use client";
import React, { useState } from "react";
import ProjectHeader from "./ProjectHeader";
import SuggestionsList from "./SuggestionsList";
import styles from "./Suggestions.module.css";
import {Header} from "./Header";
import plusIcon from "./add.png";
import SuggestionBox from "./SuggestionBox";

const Suggestions = () => {
  const [showSuggestionBox, setShowSuggestionBox] = useState(false);

  const handlePlusClick = () => {
    setShowSuggestionBox(true);
  };

  const handleClose = () => {
    setShowSuggestionBox(false);
  };

  return (
    <main className={styles.suggestions_main}>
      <Header />
      <ProjectHeader />
      <div className={styles.suggestionsContainer}>
        <h2 className={styles.ongoingProjects}>SUGGESTIONS</h2>
        <img 
          src={plusIcon} 
          alt="Add" 
          className={styles.plusIcon} 
          onClick={handlePlusClick}
        />
      </div>
      <SuggestionsList />
      {showSuggestionBox && <SuggestionBox onClose={handleClose} />}
    </main>
  );
};

export default Suggestions;