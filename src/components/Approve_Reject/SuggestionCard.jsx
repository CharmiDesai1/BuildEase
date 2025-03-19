"use client";
import React from "react";
import styles from "./Suggestions.module.css";
import upIcon from "./up.png";
import downIcon from "./down.png";

const SuggestionCard = ({ initial, date, suggestion, submitter, likes, dislikes, suggestionId, userId }) => {
  const handleVote = async (voteType, currentLikes, currentDislikes) => {
    const payload = { userId, suggestionId, voteType };
    try {
      const response = await fetch("http://localhost:5000/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) {
        // Update the votes locally (would be fetched from backend ideally)
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error voting:", error);
      alert("Error submitting vote. Try again.");
    }
  };

  return (
    <article className={styles.Container}>
    <div className={styles.suggestionCard}>
      <div className={styles.userInitial}>{initial}</div>
      <div className={styles.content}>
        <div className={styles.headerRow}>
          <div className={styles.leftContent}>
            <p className={styles.submitter}>
              <strong>Submitted By:</strong> {submitter}
            </p>
            <p className={styles.suggestionText}>Suggestion: {suggestion}</p>
          </div>
          <div className={styles.rightContent}>
            <span className={styles.date}>{date}</span>
            <div className={styles.likesCommentsContainer}>
              <div className={styles.voteSection}>
                <button className={styles.voteButton} onClick={() => handleVote("up", likes, dislikes)}>
                  <img src={upIcon} className={styles.icon} alt="Upvote" />
                </button>
                <span className={styles.voteCount}>{likes}</span>
              </div>
              <div className={styles.voteSection}>
                <button className={styles.voteButton} onClick={() => handleVote("down", likes, dislikes)}>
                  <img src={downIcon} className={styles.icon} alt="Downvote" />
                </button>
                <span className={styles.voteCount}>{dislikes}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </article>
  );
};

export default SuggestionCard;
