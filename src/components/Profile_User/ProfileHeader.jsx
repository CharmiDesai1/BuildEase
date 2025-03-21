"use client";
import React from "react";
import styles from "./InputDesign.module.css";
import EditIcon from "./Edit.png";

const ProfileHeader = ({ name, email, onClose }) => {
  return (
    <header className={styles.profileHeader}>
      <div className={styles.headerContent}>
        <div className={styles.userInfo}>
          <div className={styles.avatarContainer}>
            <div className={styles.avatar} />
            <button
              className={styles.editButton}>
                <img src={EditIcon} alt="Edit Icon" className={styles.downloadIcon} />
            </button>
          </div>
          <div className={styles.userDetails}>
            <h2 className={styles.userName}>{name}</h2>
          </div>
        </div>
      </div>
      <div className={styles.divider} />
    </header>
  );
};

export default ProfileHeader;
