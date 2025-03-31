import React, { useEffect, useState } from "react";
import TimelineChart from "./TimelineChart";
import "./TimelineChart.css";

const TimeLineUser = () => {
  const [propertyId, setPropertyId] = useState(null);
  const [propertyName, setPropertyName] = useState("Unknown");

  useEffect(() => {
    setTimeout(() => {
      const storedPropertyId = localStorage.getItem("propertyId");
      console.log("🟢 Checking property ID in localStorage:", storedPropertyId);
      if (storedPropertyId) {
        setPropertyId(parseInt(storedPropertyId, 10));
      } else {
        console.warn("⚠️ No property ID found in localStorage.");
      }
    }, 500);
  }, []);

  useEffect(() => {
    if (propertyId) {
      fetchTimelineData(propertyId);
    }
  }, [propertyId]);

  const fetchTimelineData = async (id) => {
    try {
      console.log("📡 Fetching property name for ID:", id);
      const response = await fetch(`http://localhost:5000/api/timeline/${id}`);
      if (!response.ok) throw new Error("Failed to fetch property name.");
      const data = await response.json();

      console.log("✅ Received property name:", data?.[0]?.property_name);
      setPropertyName(data?.[0]?.property_name || "Unknown Property");
    } catch (error) {
      console.error("❌ Error fetching property name:", error);
      setPropertyName("Unknown Property");
    }
  };

  return (
    <div>
      {propertyId ? (
        <TimelineChart title={propertyName} propertyId={propertyId} />
      ) : (
        <p>No property selected. Please choose a property.</p>
      )}
    </div>
  );
};

export default TimeLineUser;
