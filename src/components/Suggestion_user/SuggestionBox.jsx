import { useState, useEffect } from "react";
import styles from "./Suggestions.module.css";
import axios from "axios";

export default function SuggestionBox({ onClose }) {
  const [suggestion, setSuggestion] = useState("");
  const [userId, setUserId] = useState(null);
  const [propertyId, setPropertyId] = useState(null);
  const [userName, setUserName] = useState("");
  const maxLength = 300;

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
      fetchUserName(storedUserId);
      fetchUserProperty(storedUserId);
    }
  }, []);

  const fetchUserName = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/get-user/${userId}`);
      if (response.status === 200) {
        setUserName(response.data.full_name || "U");
      }
    } catch (error) {
      console.error("❌ Error fetching user name:", error);
    }
  };

  const fetchUserProperty = async (userId) => {
    try {
      console.log("📡 Fetching property for userId:", userId);
      const response = await fetch(`http://localhost:5000/user-properties/${userId}`);

      if (response.status === 404) {
        console.warn(`⚠️ No properties found for user ${userId}`);
        return;
      }

      if (!response.ok) throw new Error("Failed to fetch properties.");

      const data = await response.json();
      console.log("🟢 Properties received:", data);

      if (data.length > 0) {
        console.log("✅ Property ID retrieved:", data[0].id);
        setPropertyId(data[0].id);
      } else {
        console.warn("⚠️ No property found for this user.");
      }
    } catch (error) {
      console.error("❌ Error fetching user properties:", error);
    }
  };

  const handleSubmit = async () => {
    if (!suggestion.trim()) return;
    if (!userId || !propertyId) {
      alert("User ID or Property ID is missing. Unable to submit suggestion.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/add-suggestion", {
        property_id: propertyId,
        user_id: userId,
        suggestion_text: suggestion,
      });

      if (response.status === 200) {
        alert("✅ Suggestion submitted successfully!");
        setSuggestion("");
        onClose();
        window.location.reload();
      } else {
        alert("❌ Failed to submit suggestion.");
      }
    } catch (error) {
      console.error("❌ Error submitting suggestion:", error);
      alert("Error submitting suggestion. Please try again.");
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.suggestionBoxModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header_box}>
          <div className={styles.icon_box}>{userName.charAt(0).toUpperCase()}</div>
          <span className={styles.title_box}>ADD A SUGGESTION</span>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <textarea
          className={styles.textarea}
          placeholder="e.g. Need more ventilation in the kitchen"
          maxLength={maxLength}
          value={suggestion}
          onChange={(e) => setSuggestion(e.target.value)}
        />
        <div className={styles.characterCount}>
          {suggestion.length} / {maxLength} characters
        </div>
        <div className={styles.buttonContainer}>
          <button className={`${styles.button} ${styles.clear}`} onClick={() => setSuggestion("")}>
            CLEAR
          </button>
          <button
            className={`${styles.button} ${styles.submit}`}
            onClick={handleSubmit}
            disabled={!suggestion.trim()}
          >
            SUBMIT
          </button>
        </div>
      </div>
    </div>
  );
}