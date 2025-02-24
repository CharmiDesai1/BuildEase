import React from "react";
import styles from "./DevelopersLandingPage.module.css";
import {Header} from "./Header";
import {OngoingProjects} from "./OngoingProjects";
import {SuggestedFloorPlans} from "./SuggestedFloorPlans";

const DevelopersLandingPage = () => {
  return (
    <main className={styles.developersLandingPage}>
      <Header />
      <OngoingProjects />
      <SuggestedFloorPlans />
    </main>
  );
};

export default DevelopersLandingPage;
