import React from "react";
import "./TimelineChart.css";

const LegendItem = ({ completed, text }) => (
  <div className="legend-item">
    <div
      className={`legend-dot ${
        completed ? "legend-dot-completed" : "legend-dot-pending"
      }`}
    />
    <p className="legend-text">{text}</p>
  </div>
);

const TimelineLegend = () => {
  return (
    <div className="legend-container">
      <LegendItem completed={true} text="Task Accomplished" />
      <LegendItem completed={false} text="Task Pending" />
    </div>
  );
};

export default TimelineLegend;
