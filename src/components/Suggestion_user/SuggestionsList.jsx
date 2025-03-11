"use client";
import React from "react";
import SuggestionCard from "./SuggestionCard";
import styles from "./Suggestions.module.css";

const SuggestionsList = () => {
  const suggestions = [
    {
      initial: "P",
      date: "21/11/24",
      suggestion:'"design a kitchen with windows for air circulation."',
      submitter: "You",
      likes: "20",
      comments: "12",
      isPending: true,
    },
    {
      initial: "A",
      date: "24/11/24",
      suggestion: '"Including a dedicated dog park."',
      submitter: "Arun Mehta",
      likes: "2",
      comments: "3",
    },
    {
      initial: "S",
      date: "12/11/24",
      suggestion: '"Add more outdoor seating areas."',
      submitter: "Sakshi singh",
      likes: "18",
      comments: "2",
    },
  ];

  return (
    <section className={styles.suggestionsList}>
      {suggestions.map((suggestion, index) => (
        <React.Fragment key={index}>
          <SuggestionCard {...suggestion} />
          <div className={styles.divider} />
        </React.Fragment>
      ))}
    </section>
  );
};

export default SuggestionsList;
