import React, { useState, useEffect } from "react";
import styles from "./Suggestions.module.css";
import icon from "./image 28.png";
import icon2 from "./profile.png";
import { Link } from "react-router-dom";
import InputDesign from "../Profile/InputDesign";

export function Header() {
  const [showProfileCard, setShowProfileCard] = useState(false);

  const toggleProfileCard = () => {
    setShowProfileCard((prev) => !prev);
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest(`.${styles.iconWrapper}`)) {
      setShowProfileCard(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <h1 className={styles.buildEase}>
          <img src={icon} alt="icon" className={styles.logoIcon} /> Build-ease
        </h1>
        <ul className={styles.navLinks}>
          <li><Link to="/developers-landing-page" className={styles.home}>Home</Link></li>
          <li><Link to="/suggestion-page" className={styles.suggestions}>Suggestions</Link></li>
          <li><Link to="/floor-plan-page" className={styles.floorPlans}>Floor plans</Link></li>
        </ul>

        <div className={styles.rightIcons}>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/d7d1a2f2635c8c72cb6dc1307682ad41e336541b71244bfce818fbb7e9780d22?apiKey=159365e216d040bfb41dcf7dfa9bbf0b"
            className={styles.img}
            alt="Notification"
          />
          <div className={styles.iconWrapper} onClick={toggleProfileCard}>
            <img src={icon2} alt="Profile" className={styles.profileIcon} />
            {showProfileCard && (
              <div className={styles.profileCardWrapper}>
                <InputDesign />
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
