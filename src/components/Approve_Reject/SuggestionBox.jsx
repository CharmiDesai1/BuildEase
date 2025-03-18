import { useState, useEffect } from "react";
import styles from "./Suggestions.module.css";
import axios from "axios";

export default function SuggestionBox({ onClose }) {
  const [suggestion, setSuggestion] = useState("");
  const [userId, setUserId] = useState(null);
  const [propertyId, setPropertyId] = useState(null);
  const [userName, setUserName] = useState("U");
  const maxLength = 300;

  useEffect(() => {
    // 1️⃣ Fetch propertyId from localStorage
    const storedPropertyId = localStorage.getItem("propertyId");
    if (storedPropertyId) {
      setPropertyId(storedPropertyId);
      fetchUserId(storedPropertyId);
    } else {
      console.warn("⚠️ No propertyId found in localStorage.");
    }
  }, []);

  // 2️⃣ Fetch userId using propertyId from PropertySuggestions table
  const fetchUserId = async (propertyId) => {
    try {
      console.log("📡 Fetching userId for propertyId:", propertyId);
      const response = await axios.get(`http://localhost:5000/api/dev/get-user/${propertyId}`);

      if (response.status === 200 && response.data.user_id) {
        setUserId(response.data.user_id);
        fetchUserDetails(response.data.user_id);
      } else {
        console.warn("⚠️ No user found for this property.");
      }
    } catch (error) {
      console.error("❌ Error fetching userId:", error);
    }
  };

  // 3️⃣ Fetch user details using userId
  const fetchUserDetails = async (userId) => {
    try {
      console.log("📡 Fetching user details for userId:", userId);
      const response = await axios.get(`http://localhost:5000/api/dev/user-details/${userId}`);

      if (response.status === 200) {
        const { full_name } = response.data;
        setUserName(full_name || "U");
      }
    } catch (error) {
      console.error("❌ Error fetching user details:", error);
    }
  };

  // 4️⃣ Submit Suggestion
  const handleSubmit = async () => {
    if (!suggestion.trim()) return;
    if (!userId || !propertyId) {
      alert("⚠️ Missing User ID or Property ID. Unable to submit.");
      return;
    }

    try {
      console.log("📡 Submitting suggestion...");
      const response = await axios.post("http://localhost:5000/api/dev/add-suggestion", {
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
