import React from "react";
import styles from "./DevelopersLandingPage.module.css";
import { FloorPlanCard } from "./FloorPlanCard";

export function SuggestedFloorPlans() {
  return (
    <section className={styles.suggestedFloorPlansSection}>
      <h2 className={styles.suggestedFloorPlans}>SUGGESTED FLOOR PLANS</h2>
      <div className={styles.floorPlansGrid}>
        <FloorPlanCard
          image="https://cdn.builder.io/api/v1/image/assets/TEMP/980b2b6c2f95d464a0d6308b897343ea7790b0b15e4d994075b8d44aec3ba12e?placeholderIfAbsent=true&apiKey=159365e216d040bfb41dcf7dfa9bbf0b"
          submitter="xyz"
          carpetSize="1,000-1,050 sq ft"
          projectName="A Anantara"
        />
        <FloorPlanCard
          image="https://cdn.builder.io/api/v1/image/assets/TEMP/601060ec1fb9259f3afdf8e517bbd62d8bfa399568b93a888bfe4821078c5ffb?placeholderIfAbsent=true&apiKey=159365e216d040bfb41dcf7dfa9bbf0b"
          submitter="xyz"
          carpetSize="1,000-1,050 sq ft"
          projectName="A Anantara"
        />
        <FloorPlanCard
          image="https://cdn.builder.io/api/v1/image/assets/TEMP/621677265747309557a8265a566f0b55344c87a38f539b1c455e3e034f2bbe23?placeholderIfAbsent=true&apiKey=159365e216d040bfb41dcf7dfa9bbf0b"
          submitter="xyz"
          carpetSize="1,000-1,050 sq ft"
          projectName="A Anantara"
        />
      </div>
      <div className={styles.pagination}>
        <div className={styles.paginationDot} />
        <div className={styles.paginationDot} />
        <div className={styles.paginationDot} />
        <div className={styles.paginationDot} />
      </div>
    </section>
  );
}
