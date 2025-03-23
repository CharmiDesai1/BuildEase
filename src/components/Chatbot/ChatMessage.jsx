"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./ChatInterface.module.css";
import botAvatar from "./Chatbot.png";

function ChatMessage({ sender, content }) {
  const [userInitial, setUserInitial] = useState("U");
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    axios
      .get(`http://localhost:5000/api/user/${userId}`)
      .then((res) => {
        const userName = res.data?.full_name || "User";
        setUserInitial(userName.charAt(0).toUpperCase());
      })
      .catch((err) => console.error("Failed to fetch user data:", err));
  }, []);

  return sender === "bot" ? (
    <article className={styles.messageRow}>
      <div className={styles.avatarWrapper}>
      <div className={styles.avatarWrapper}>
        <img src={botAvatar} alt="Bot Avatar" className={styles.avatar} />
      </div>
      </div>
      <p className={styles.botMessageLight}>{content}</p>
    </article>
  ) : (
    <article className={styles.userMessageRow}>
            <p className={styles.userMessage}>{content}</p>
      <div className={styles.userAvatar}>{userInitial}</div>
    </article>
  );
}

export default ChatMessage;
