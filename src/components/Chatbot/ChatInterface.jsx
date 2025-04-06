"use client";
import React, { useState, useEffect } from "react";
import styles from "./ChatInterface.module.css";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import axios from "axios";

function ChatInterface() {
  const [messages, setMessages] = useState([
    { sender: "bot", content: "Hi! How can I assist you today?" },
  ]);
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(parseInt(storedUserId, 10));
    } else {
      console.warn("No userId found in local storage!");
    }
  }, []);

  const getBotResponse = async (userMessage) => {
    if (!userId) return "User not logged in. Please refresh and try again.";

    try {
      const response = await axios.post("http://localhost:5000/api/chat", {
        userId,
        message: userMessage,
      });

      return response.data.reply;
    } catch (error) {
      console.error("Backend Error:", error);
      return "Error fetching response. Please try again.";
    }
  };

  const handleSendMessage = async (userMessage) => {
    const newUserMessage = { sender: "user", content: userMessage };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);

    const botResponseText = await getBotResponse(userMessage);
    const botResponse = { sender: "bot", content: botResponseText };

    setMessages((prevMessages) => [...prevMessages, botResponse]);
  };

  return (
    <main className={styles.chatContainer}>
      <ChatHeader />
      <section className={styles.conversationArea}>
        {messages.map((msg, index) => (
          <ChatMessage key={index} sender={msg.sender} content={msg.content} />
        ))}
      </section>
      <ChatInput onSend={handleSendMessage} />
    </main>
  );
}

export default ChatInterface;