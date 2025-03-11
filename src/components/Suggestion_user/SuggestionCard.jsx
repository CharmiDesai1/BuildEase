"use client";
import React, { useState } from "react";
import styles from "./Suggestions.module.css";
import upIcon from "./up.png";
import downIcon from "./down.png";

const SuggestionCard = ({ initial, date, suggestion, submitter, likes, dislikes, suggestionId, userId }) => {
  const [likeCount, setLikeCount] = useState(likes);
  const [dislikeCount, setDislikeCount] = useState(dislikes);
  const [userVote, setUserVote] = useState(null); 

  const handleVote = async (voteType) => {
    if (userVote === voteType) return; 
  
    const payload = {
      userId,         
      suggestionId,   
      voteType,      
    };
  
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
          setLikeCount(userVote === "down" ? likeCount + 1 : likeCount + 1);
          setDislikeCount(userVote === "down" ? dislikeCount - 1 : dislikeCount);
        } else {
          setDislikeCount(userVote === "up" ? dislikeCount + 1 : dislikeCount + 1);
          setLikeCount(userVote === "up" ? likeCount - 1 : likeCount);
        }
  
        setUserVote(voteType);
      }
    } catch (error) {
      console.error("❌ Error voting:", error);
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
