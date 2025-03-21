"use client";
import React from "react";
import styles from "./ChatInterface.module.css";

function ChatInput({ placeholder }) {
  return (
    <div className={styles.inputContainer}>
      <input
        type="text"
        placeholder={placeholder}
        className={styles.messageInput}
      />
    </div>
  );
}

export default ChatInput;
