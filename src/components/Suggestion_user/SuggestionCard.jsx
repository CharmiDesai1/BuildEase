"use client";
import React, { useState } from "react";
import styles from "./Suggestions.module.css";
import upIcon from "./up.png";
import downIcon from "./down.png";

const SuggestionCard = ({ initial, date, suggestion, submitter, likes, dislikes, suggestionId, userId, status }) => {
  const [likeCount, setLikeCount] = useState(likes);
  const [dislikeCount, setDislikeCount] = useState(dislikes);
  const [userVote, setUserVote] = useState(null); 

  const handleVote = async (voteType) => {
    if (!userId || !suggestionId) {
      alert("❌ User ID or Suggestion ID missing.");
      return;
    }
    
    if (userVote === voteType) return;

    const payload = { userId, suggestionId, voteType };
    console.log("📡 Sending vote request:", payload);

    try {
      const response = await fetch("http://localhost:5000/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("✅ Vote API Response:", data);

      if (data.success) {
        if (voteType === "up") {
          setLikeCount((prev) => (userVote === "down" ? prev + 1 : prev + 1));
          setDislikeCount((prev) => (userVote === "down" ? prev - 1 : prev));
        } else {
          setDislikeCount((prev) => (userVote === "up" ? prev + 1 : prev + 1));
          setLikeCount((prev) => (userVote === "up" ? prev - 1 : prev));
        }

        setUserVote(voteType);

        setTimeout(() => window.location.reload(), 500);
      } else {
        alert("❌ Error: " + data.message);
      }
    } catch (error) {
      console.error("❌ Error voting:", error);
      alert("❌ Error submitting vote. Try again.");
    }
  };  

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
              <p className={styles.statusText}>
                Status: {status || "No action taken"}
              </p>
            </div>
            <div className={styles.rightContent}>
              <span className={styles.date}>{date}</span>
              <div className={styles.likesCommentsContainer}>
                <div className={styles.voteSection}>
                  <button
                    className={`${styles.voteButton} ${userVote === "up" ? styles.active : ""}`}
                    onClick={() => handleVote("up")}
                  >
                    <img src={upIcon} className={styles.icon} alt="Upvote" />
                  </button>
                  <span className={styles.voteCount}>{likeCount}</span>
                </div>
                <div className={styles.voteSection}>
                  <button
                    className={`${styles.voteButton} ${userVote === "down" ? styles.active : ""}`}
                    onClick={() => handleVote("down")}
                  >
                    <img src={downIcon} className={styles.icon} alt="Downvote" />
                  </button>
                  <span className={styles.voteCount}>{dislikeCount}</span>
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