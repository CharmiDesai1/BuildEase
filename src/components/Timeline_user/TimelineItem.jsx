import React from "react";
import "./TimelineChart.css";

const TimelineItem = ({ date, task, completed, isLast }) => {
  return (
    <div className={`timeline-item ${isLast ? "timeline-item-last" : ""}`}>
      {date && <p className="timeline-date">{date}</p>}
      <div
        className={`timeline-node ${completed ? "timeline-node-completed" : "timeline-node-pending"}`}
      />
      <div className="timeline-task-container">
        <p className="timeline-task-text">{task}</p>
      </div>
    </div>
  );
};

export default TimelineItem;