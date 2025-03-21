import React from "react";
import styles from "./ChatInterface.module.css";

function ChatHeader() {
  return (
    <header className={styles.chatHeader}>
      <div className={styles.avatarWrapper}>
        <div className={styles.avatar} />
      </div>
      <div className={styles.headerInfo}>
        <h1 className={styles.chatbotName}>Chatbot</h1>
        <div className={styles.statusContainer}>
          <p className={styles.statusText}>online</p>
          <div className={styles.statusIndicator} />
        </div>
      </div>
    </header>
  );
}

export default ChatHeader;
