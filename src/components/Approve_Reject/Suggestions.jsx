"use client";
import React, { useState } from "react";
import ProjectHeader from "./ProjectHeader";
import SuggestionsList from "./SuggestionsList";
import styles from "./Suggestions.module.css";
import {Header} from "./Header";

const Suggestions = () => {

  return (
    <main className={styles.suggestions_main}>
      <Header />
      <ProjectHeader />
      <div className={styles.suggestionsContainer}>
        <h2 className={styles.ongoingProjects}>SUGGESTIONS</h2>
      </div>
      <SuggestionsList />
    </main>
  );
};

export default Suggestions;
