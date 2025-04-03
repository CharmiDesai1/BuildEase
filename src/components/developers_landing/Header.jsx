import React, { useState, useEffect } from "react";
import styles from "./DevelopersLandingPage.module.css";
import icon from "./image 28.png";
import icon2 from "./profile.png";
import { Link } from "react-router-dom";
import InputDesign from "../Profile/InputDesign";
import Notification from "../Notification_Developer/Notification";
import notification from "./notification.png"

export function Header() {
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [showNotificationCard, setShowNotificationCard] = useState(false);

  const toggleProfileCard = () => {
    setShowProfileCard((prev) => !prev);
    setShowNotificationCard(false);
  };

  const toggleNotificationCard = () => {
    setShowNotificationCard((prev) => !prev);
    setShowProfileCard(false);
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest(`.${styles.iconWrapper}`)) {
      setShowProfileCard(false);
    }
    if (!e.target.closest(`.${styles.notificationWrapper}`)) {
      setShowNotificationCard(false);
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
          <li><Link to="/floor-plan-page" className={styles.floorPlans}>Floor Plans</Link></li>
        </ul>

        <div className={styles.rightIcons}>
        <div className={styles.notificationWrapper} onClick={toggleNotificationCard}>
            <img src={notification} alt="Notification" className={styles.notification} />
            {showNotificationCard && (
              <div className={styles.notificationCardWrapper}>
                <Notification />
              </div>
            )}
          </div>
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
