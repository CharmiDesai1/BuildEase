"use client";
import React, { useEffect, useState } from "react";
import styles from "./InputDesign.module.css";
import ProfileHeader from "./ProfileHeader";
import ProfileDetails from "./ProfileDetails";
import LogoutIcon from "./logout.png";

function InputDesign() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId"); 
    if (userId) {
      fetch(`http://localhost:5000/api/user/${userId}`)
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
        .catch(err => console.error("Failed to fetch user data:", err));
    }
  }, []);

  const handleClose = () => {
    localStorage.removeItem("userId");
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