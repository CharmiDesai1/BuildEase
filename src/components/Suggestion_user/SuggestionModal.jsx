import React, { useState } from "react";
import styles from "./Suggestions.module.css";

const SuggestionModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null; // Prevents rendering when closed

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <span className={styles.profileIcon}>P</span>
          <h2 className={styles.title}>ADD A SUGGESTION</h2>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>
        <textarea
          className={styles.textArea}
          placeholder="e.g. Need more ventilation in the kitchen"
          maxLength={300}
        />
        <div className={styles.footer}>
          <span className={styles.charCount}>300 characters</span>
          <div className={styles.buttons}>
            <button className={styles.clearButton}>CLEAR</button>
            <button className={styles.submitButton}>SUBMIT</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestionModal;
