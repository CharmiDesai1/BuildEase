"use client";
import React, { useEffect, useState } from "react";
import SuggestionCard from "./SuggestionCard";
import styles from "./Suggestions.module.css";

const SuggestionsList = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [propertyId, setPropertyId] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      console.warn("⚠️ No user ID found in local storage.");
      return;
    }

    const fetchUserProperties = async () => {
      try {
        console.log("📡 Fetching property for userId:", userId);
        const response = await fetch(`http://localhost:5000/user-properties/${userId}`);

        if (response.status === 404) {
          console.warn(`⚠️ No properties found for user ${userId}`);
          setLoading(false);
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
          setLoading(false);
        }
      } catch (error) {
        console.error("❌ Error fetching user properties:", error);
        setLoading(false);
      }
    };

    fetchUserProperties();
  }, [userId]);

  useEffect(() => {
    if (!propertyId) {
      console.warn("⚠️ No propertyId available, skipping API call.");
      setLoading(false);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        console.log(`📡 Fetching suggestions for propertyId: ${propertyId}`);
        const response = await fetch(`http://localhost:5000/api/suggestions?propertyId=${propertyId}`);

        if (response.status === 404) {
          console.warn("⚠️ No suggestions found for this property.");
          setSuggestions([]);
          setLoading(false);
          return;
        }

        if (!response.ok) throw new Error("Failed to fetch suggestions.");

        const data = await response.json();
        console.log("✅ Suggestions fetched:", data);
        setSuggestions(data);
      } catch (error) {
        console.error("❌ Error fetching suggestions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [propertyId]);

  if (loading) return <p>Loading suggestions...</p>;
  if (!propertyId) return <p className={styles.error}>No property selected.</p>;

  return (
    <section className={styles.suggestionsList}>
      {suggestions.length > 0 ? (
        suggestions.map((suggestion) => {
          console.log("Debug: Created At Value ->", suggestion.created_at); // Debugging line

          const formattedDate = suggestion.created_at
            ? new Date(suggestion.created_at).toLocaleDateString()
            : new Date().toLocaleDateString();

          return (
            <React.Fragment key={suggestion.id}>
              <SuggestionCard 
                initial={suggestion.submitter?.charAt(0).toUpperCase() || "?"}
                date={formattedDate}            
                suggestion={suggestion.suggestion} // Changed from suggestion to suggestion_text
                submitter={suggestion.submitter} // Changed from submitter to full_name
                likes={suggestion.likes}
                dislikes={suggestion.dislikes}
                suggestionId={suggestion.id} 
                userId={userId}
                isPending={suggestion.isPending || false} 
              />
              <div className={styles.divider} />
            </React.Fragment>
          );
        })
      ) : (
        <p>No suggestions available.</p>
      )}
    </section>
  );
};

export default SuggestionsList;
