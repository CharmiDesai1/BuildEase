"use client";
import React from "react";
import styles from "./Suggestions.module.css";
import upIcon from "./up.png"; // ✅ Import upvote image
import downIcon from "./down.png"; // ✅ Import downvote image

const SuggestionCard = ({
  initial,
  date,
  suggestion,
  submitter,
  likes,
  comments,
}) => {
  return (
    <article className={styles.Container}>
      <div className={styles.suggestionCard}>
        <div className={styles.userInitial}>{initial}</div>
        <div className={styles.content}>
          <div className={styles.headerRow}>
            <div className={styles.leftContent}>
              {submitter && (
                <p className={styles.submitter}>
                  <strong>Submitted By Buyer:</strong> {submitter}
                </p>
              )}
              <p className={styles.suggestionText}>Suggestion: {suggestion}</p>
            </div>
            {/* ✅ Date & Icons aligned correctly without causing gaps */}
            <div className={styles.rightContent}>
              <span className={styles.date}>{date}</span>
              <div className={styles.likesCommentsContainer}>
                {likes && (
                  <div className={styles.likes}>
                    <img src={upIcon} className={styles.icon} alt="Upvote" />
                    <span>{likes}</span>
                  </div>
                )}
                {comments && (
                  <div className={styles.comments}>
                    <img src={downIcon} className={styles.icon} alt="Downvote" />
                    <span>{comments}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default SuggestionCard;