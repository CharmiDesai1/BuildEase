"use client";
import React, { useState } from "react";
import styles from "./ChatInterface.module.css";

function ChatInput({ onSend }) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.inputContainer}>
      <input
        type="text"
        placeholder="Type here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        className={styles.messageInput}
      />
      <button className={styles.sendButton} onClick={handleSend}>Send</button>
    </div>
  );
}

export default ChatInput;
