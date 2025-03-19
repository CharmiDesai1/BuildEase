import { useState, useEffect } from "react";
import styles from "./Suggestions.module.css";
import axios from "axios";

export default function SuggestionBox({ onClose }) {
  const [suggestion, setSuggestion] = useState("");
  const [userId, setUserId] = useState(null);
  const [propertyId, setPropertyId] = useState(null);
  const [userName, setUserName] = useState("U");
  const [suggestions, setSuggestions] = useState([]); // Store fetched suggestions
  const maxLength = 300;

  useEffect(() => {
    const storedPropertyId = localStorage.getItem("propertyId");
    console.log("🔍 useEffect - Retrieved propertyId:", storedPropertyId);
  
    if (storedPropertyId) {
      setPropertyId(parseInt(storedPropertyId, 10));
      console.log("✅ propertyId state updated:", parseInt(storedPropertyId, 10));
    } else {
      console.warn("⚠️ No propertyId found in localStorage.");
    }
  }, []);

  useEffect(() => {
    if (!propertyId) {
      console.warn("⏳ propertyId not available yet. Waiting...");
      return;
    }
  
    console.log("🚀 Fetching userId and suggestions for propertyId:", propertyId);
    fetchUserId(propertyId);
    fetchSuggestions(propertyId);
  }, [propertyId]);  

  const fetchUserId = async (propertyId) => {
    try {
      console.log("📡 Fetching userId for propertyId:", propertyId);
      const response = await axios.get(`http://localhost:5000/api/dev/get-user/${propertyId}`);

      if (response.status === 200 && response.data.users && response.data.users.length > 0) {
        const userIds = response.data.users.map(user => user.user_id); // Extract all user IDs
        setUserId(userIds); // Store all user IDs
        userIds.forEach(fetchUserDetails); // Fetch details for each user
      } else {
          console.warn("⚠️ No valid user_id found in response.");
      }
    } catch (error) {
      console.error("❌ Error fetching userId:", error);
    }
  };

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

  const fetchSuggestions = async (propertyId) => {
    try {
      console.log("📡 Fetching suggestions for propertyId:", propertyId);
      const response = await axios.get(`http://localhost:5000/api/dev/suggestions/${propertyId}`);

      if (response.status === 200) {
        console.log("✅ Suggestions fetched:", response.data);
        setSuggestions(response.data); // Store suggestions
      } else {
        console.warn("⚠️ No suggestions found.");
      }
    } catch (error) {
      console.error("❌ Error fetching suggestions:", error);
    }
  };

  const handleSubmit = async () => {
    if (!suggestion.trim()) return;
    if (!userId || !propertyId) {
      alert("⚠️ Missing User ID or Property ID. Unable to submit.");
      return;
    }

    try {
      console.log("📡 Submitting suggestion for property:", propertyId);
      const response = await axios.post("http://localhost:5000/api/dev/add-suggestion", {
        property_id: propertyId,
        user_id: userId,
        suggestion_text: suggestion,
      });

      if (response.status === 200) {
        alert("✅ Suggestion submitted successfully!");
        setSuggestion("");
        fetchSuggestions(propertyId); // Refresh the suggestions list after submission
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

        {/* Display fetched suggestions */}
        <div className={styles.suggestionsList}>
          <h3>Previous Suggestions</h3>
          {suggestions.length > 0 ? (
            suggestions.map((sugg, index) => (
              <div key={index} className={styles.suggestionItem}>
                <p><strong>{sugg.user_name || "Anonymous"}:</strong> {sugg.suggestion_text}</p>
              </div>
            ))
          ) : (
            <p>No suggestions available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
