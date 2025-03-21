"use client";
import React, { useEffect, useState } from "react";
import styles from "./InputDesign.module.css";
import ProfileHeader from "./ProfileHeader";
import ProfileDetails from "./ProfileDetails";
import LogoutIcon from "./logout.png";

function InputDesign() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const developerId = localStorage.getItem("developer_id");
    if (developerId) {
      fetch(`http://localhost:5000/api/developer/${developerId}`)
        .then(res => res.json())
        .then(data => {
          setUserData({
            name: data.full_name,
            details: {
              email: data.email,
              mobile: data.mobile_number,
            },
          });
        })
        .catch(err => console.error("Failed to fetch developer data:", err));
    }
  }, []);

  const handleClose = () => {
    localStorage.removeItem("developer_id");
    window.location.href = "http://localhost:3000/";
  };

  if (!userData) return <div>Loading...</div>;

  return (
    <article className={styles.profileCard}>
      <ProfileHeader
        name={userData.name}
        email={userData.email}
        onClose={handleClose}
      />
      <ProfileDetails details={userData.details} />
      <button className={styles.downloadButton} onClick={handleClose}>
        Logout
        <span className={styles.downloadIconContainer}>
          <img src={LogoutIcon} alt="Logout Icon" className={styles.downloadIcon} />
        </span>
      </button>
    </article>
  );
}

export default InputDesign;
