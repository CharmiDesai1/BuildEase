"use client";

import React from "react";
import styles from "./SuggestionPage.module.css";

export function ScrollToTop() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className={styles.scrollToTop}
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
}
