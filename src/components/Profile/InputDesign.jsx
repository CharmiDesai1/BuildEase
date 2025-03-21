"use client";
import React from "react";
import styles from "./InputDesign.module.css";
import ProfileHeader from "./ProfileHeader";
import ProfileDetails from "./ProfileDetails";
import LogoutIcon from "./logout.png";

function InputDesign() {
  const userData = {
    name: "PRANJAL SHAH",
    email: "xyz@gmail.com",
    details: {
      name: "Pranjal shah",
      email: "pranjal2025@gmail.com",
      mobile: "+918200867810",
      location: "India",
    },
  };

  const handleClose = () => {
    console.log("Close profile");
  };

  return (
    <article className={styles.profileCard}>
      <ProfileHeader
        name={userData.name}
        email={userData.email}
        onClose={handleClose}
      />

      <ProfileDetails details={userData.details} />
      <button
        className={styles.downloadButton}>
          Logout
          <span className={styles.downloadIconContainer}>
            <img src={LogoutIcon} alt="Logout Icon" className={styles.downloadIcon} />
          </span>
      </button>
    </article>
  );
}

export default InputDesign;
