import React from "react";
import { Header } from "./Header";
import TimelineItem from "./TimelineItem";
import TimelineLegend from "./TimelineLegend";
import "./TimelineChart.css";

const TimelineChart = ({
  title = "SHRIDHAR ATHENS TIMELINE CHART",
  timelineItems = defaultTimelineItems,
  lastUpdated = "Last updated 1 week ago",
}) => {
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
            date={item.date}
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

// Default timeline items if none are provided
const defaultTimelineItems = [
  { date: "12-6-24", task: "TASKK xyz", completed: true },
  { date: "19-7-24", task: "TASKK xyz", completed: true },
  { date: "28-8-24", task: "TASKK xyz", completed: true },
  { date: "7-10-24", task: "TASKK xyz", completed: true },
  { date: "11-11-24", task: "TASKK xyz", completed: true },
  { date: null, task: "TASKK xyz", completed: false },
  { date: null, task: "TASKK xyz", completed: false },
  { date: null, task: "TASKK xyz", completed: false },
];

export default TimelineChart;
