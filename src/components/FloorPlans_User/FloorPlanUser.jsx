"use client";
import React from "react";
import styles from "./FloorPlanUser.module.css";
import { Header } from "./Header";
import { FloorPlanViewer } from "./FloorPlanViewer";

const FloorPlanUser = () => {
  return (
    <main className={styles.floorPlanUser}>
      <Header />
      <FloorPlanViewer />
    </main>
  );
};

export default FloorPlanUser;
