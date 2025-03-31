"use client";
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./InputDesign.module.css";
import EditIcon from "./Edit.png";

const ProfileHeader = ({ name, email, onClose }) => {
  const navigate = useNavigate();
  const initial = name ? name.charAt(0).toUpperCase() : "";

  const handleEditClick = () => {
    navigate("/edit-profile-developer");
  };

  return (
    <header className={styles.profileHeader}>
      <div className={styles.headerContent}>
        <div className={styles.userInfo}>
          <div className={styles.avatarContainer}>
          <div className={styles.avatar}>
              {initial}
            </div>
            <button className={styles.editButton} onClick={handleEditClick}>
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
