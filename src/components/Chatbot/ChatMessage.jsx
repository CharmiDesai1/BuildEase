import React from "react";
import styles from "./ChatInterface.module.css";

function ChatMessage({ sender, content }) {
  if (sender === "bot") {
    return (
      <article className={styles.messageRow}>
        <div className={styles.avatarWrapper}>
          <div className={styles.avatar} />
        </div>
        <p
          className={
            content === "Hi!" ? styles.botMessageLight : styles.botMessageLight
          }
        >
          {content}
        </p>
      </article>
    );
  } else {
    return (
      <article className={styles.userMessageRow}>
        <p className={styles.userMessage}>{content}</p>
        <div className={styles.userAvatar}>P</div>
      </article>
    );
  }
}

export default ChatMessage;
