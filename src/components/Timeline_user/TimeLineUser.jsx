import React from "react";
import TimelineChart from "./TimelineChart";
import "./TimelineChart.css";

const TimeLineUser = () => {
  const timelineData = [
    { date: "12-6-24", task: "TASKK xyz", completed: true },
    { date: "19-7-24", task: "TASKK xyz", completed: true },
    { date: "28-8-24", task: "TASKK xyz", completed: true },
    { date: "7-10-24", task: "TASKK xyz", completed: true },
    { date: "11-11-24", task: "TASKK xyz", completed: true },
    { date: null, task: "TASKK xyz", completed: false },
    { date: null, task: "TASKK xyz", completed: false },
    { date: null, task: "TASKK xyz", completed: false },
  ];

  return (
    <TimelineChart
      title="SHRIDHAR ATHENS TIMELINE CHART"
      timelineItems={timelineData}
      lastUpdated="Last updated 1 week ago"
    />
  );
};

export default TimeLineUser;
