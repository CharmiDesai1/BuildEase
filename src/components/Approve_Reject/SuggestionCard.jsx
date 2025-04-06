"use client";
import React, { useState } from "react";
import styles from "./Suggestions.module.css";
import upIcon from "./up.png";
import downIcon from "./down.png";
import approveIcon from "./Approve.png";
import rejectIcon from "./Reject.png";
import onholdIcon from "./Onhold.png";

const SuggestionCard = ({ initial, date, suggestion, submitter, likes, dislikes, suggestionId, userId, status }) => {
  const [suggestionStatus, setSuggestionStatus] = useState(status);
  void suggestionStatus;

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
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error voting:", error);
      alert("Error submitting vote. Try again.");
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      console.log(`Updating status for suggestion ${suggestionId} → ${newStatus}`);
      const response = await fetch("http://localhost:5000/api/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suggestionId, status: newStatus }),
      });

      const data = await response.json();
      if (data.success) {
        console.log("Status updated:", newStatus);
        setSuggestionStatus(newStatus);
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
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
            <div className={styles.buttonContainer}>
            <button className={styles.Button} onClick={() => updateStatus("Approved")}>
              Approve
              <span className={styles.IconContainer}>
                <img src={approveIcon} alt="Approve Icon" className={styles.ButtonIcon} />
              </span>
            </button>
            <button className={styles.Button} onClick={() => updateStatus("Rejected")}>
              Reject
              <span className={styles.IconContainer}>
                <img src={rejectIcon} alt="Reject Icon" className={styles.ButtonIcon} />
              </span>
            </button>
            <button className={styles.Button} onClick={() => updateStatus("On Hold")}>
              Onhold
              <span className={styles.IconContainer}>
                <img src={onholdIcon} alt="Onhold Icon" className={styles.ButtonIcon} />
              </span>
            </button>
            </div>
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