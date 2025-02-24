import React from "react";
import styles from "./DevelopersLandingPage.module.css";
import icon from "./image 28.png";
import icon2 from "./profile.png";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        {/* Left-aligned logo & name */}
        <h1 className={styles.buildEase}>
          <img src={icon} alt="icon" className={styles.logoIcon} /> Build-ease
        </h1>

        {/* Centered navigation links */}
        <ul className={styles.navLinks}>
          <li><a href="#" className={styles.home}>Home</a></li>
          <li><a href="#" className={styles.manageSites}>Manage sites</a></li>
          <li><Link to="/suggestion-page" className={styles.suggestions}>Suggestions</Link></li>
          <li><a href="#" className={styles.floorPlans}>Floor plans</a></li>
        </ul>

        {/* Right-aligned notification & profile icons */}
        <div className={styles.rightIcons}>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/d7d1a2f2635c8c72cb6dc1307682ad41e336541b71244bfce818fbb7e9780d22?apiKey=159365e216d040bfb41dcf7dfa9bbf0b"
            className={styles.img}
            alt="Notification"
          />
          <div className={styles.iconWrapper}>
          <img src={icon2} alt="Profile" className={styles.profileIcon} />
          </div>
        </div>
      </nav>
    </header>
  );
}
