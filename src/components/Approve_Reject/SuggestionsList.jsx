"use client";
import React, { useEffect, useState } from "react";
import SuggestionCard from "./SuggestionCard";
import styles from "./Suggestions.module.css";

const SuggestionsList = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [propertyId, setPropertyId] = useState(null);
  const [users, setUsers] = useState([]);
  void users;

  useEffect(() => {
    const storedPropertyId = localStorage.getItem("propertyId");
    if (storedPropertyId) {
      const parsedPropertyId = parseInt(storedPropertyId, 10);
      setPropertyId(parsedPropertyId);
      fetchUsersAndSuggestions(parsedPropertyId);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUsersAndSuggestions = async (propertyId) => {
    try {
      const userResponse = await fetch(`http://localhost:5000/api/dev/get-user/${propertyId}`);
      if (!userResponse.ok) throw new Error(`Failed to fetch users.`);
      const userData = await userResponse.json();
      setUsers(userData.users || []);

      const suggestionResponse = await fetch(`http://localhost:5000/api/dev/suggestions/${propertyId}`);
      if (!suggestionResponse.ok) throw new Error(`Failed to fetch suggestions.`);
      const suggestionData = await suggestionResponse.json();

      const uniqueSuggestions = Array.from(new Map(suggestionData.map(item => [item.id, item])).values());
      setSuggestions(uniqueSuggestions);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const processedSuggestions = suggestions.map((suggestion) => ({
    ...suggestion,
    submitter: suggestion.full_name || "Unknown User",
}));

const formatDate = (dateString) => {
  if (!dateString) return "Date Not Available";

  const parts = dateString.split("/");
  if (parts.length === 3) {
    return `${parts[0].padStart(2, "0")}/${parts[1].padStart(2, "0")}/${parts[2]}`;
  }

  return "Invalid Date";
};

  if (loading) return <p>Loading suggestions...</p>;
  if (!propertyId) return <p className={styles.error}>No property selected.</p>;

  return (
    <section className={styles.suggestionsList}>
      {processedSuggestions.length > 0 ? (
        processedSuggestions.map((suggestion) => (
          <React.Fragment key={suggestion.id}>
            <SuggestionCard 
              initial={suggestion.submitter ? suggestion.submitter.charAt(0).toUpperCase() : "?"}
              date={formatDate(suggestion.created_at)}       
              suggestion={suggestion.suggestion_text}
              submitter={suggestion.submitter}
              likes={suggestion.likes}
              dislikes={suggestion.dislikes}
              suggestionId={suggestion.id} 
              userId={suggestion.user_id}
              isPending={suggestion.isPending || false}
            />
            <div className={styles.divider} />
          </React.Fragment>
        ))
      ) : (
        <p>No suggestions available.</p>
      )}
    </section>
  );
};

export default SuggestionsList;