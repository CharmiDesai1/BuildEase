import React, { useEffect, useState } from "react";
import TimelineItem from "./TimelineItem";
import TimelineLegend from "./TimelineLegend";
import "./TimelineChart.css";

const TimelineChart = ({ title = "Property Timeline Chart", propertyId }) => {
  const [timelineItems, setTimelineItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("Fetching last update...");

  const formatDate = (dateString) => {
    if (!dateString || dateString === "Date Not Available") return "Date Not Available";
  
    const parts = dateString.split("/");
    if (parts.length === 3) {
      return `${parts[0]}/${parts[1]}/${parts[2]}`;
    }
    
    return "Invalid Date"; 
  };

  useEffect(() => {
    if (!propertyId) {
      console.warn("No property ID found.");
      setLoading(false);
      return;
    }

    const fetchTimelineData = async () => {
      try {
        console.log("Fetching timeline data for propertyId:", propertyId);
        const response = await fetch(`http://localhost:5000/api/timeline/${propertyId}`);

        if (!response.ok) throw new Error("Failed to fetch timeline data.");

        const data = await response.json();
        console.log("Timeline data received:", data);

        const processedData = data.map((item) => ({
          date: item.date ? formatDate(item.date) : "TBD",
          task: item.task,
          completed: item.completed === "Completed",
        }));

        setTimelineItems(processedData);
        setLastUpdated(`Last updated ${new Date().toLocaleDateString("en-GB")}`);
      } catch (error) {
        console.error("Error fetching timeline data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimelineData();
  }, [propertyId]);

  if (loading) return <p>Loading timeline...</p>;

  return (
    <div className="container">
      <div className="header-container">
        <h2 className="header-title">{title}</h2>
      </div>
      <div className="timeline-container">
        <div className="timeline-line" />

        {timelineItems.map((item, index) => (
          <TimelineItem
            key={index}
            date={formatDate(item.date)}
            task={item.task}
            completed={item.completed}
            isLast={index === timelineItems.length - 1}
          />
        ))}
      </div>

      <TimelineLegend />

      <div className="last-updated-container">
        <p className="last-updated-text">{lastUpdated}</p>
      </div>
    </div>
  );
};

export default TimelineChart;