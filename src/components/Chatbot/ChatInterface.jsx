"use client";
import React from "react";
import styles from "./ChatInterface.module.css";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

function ChatInterface() {
  return (
    <main className={styles.chatContainer}>
      <ChatHeader />
      <section className={styles.conversationArea}>
        <ChatMessage sender="bot" content="Hi!" />
        <ChatMessage sender="bot" content="How can I help you?" />
        <ChatMessage
          sender="user"
          content="I have query related to parking space allocated"
        />
        <ChatMessage sender="bot" content="Can you provide your number?" />
        <ChatInput placeholder="Type here.." />
      </section>
    </main>
  );
}

export default ChatInterface;
