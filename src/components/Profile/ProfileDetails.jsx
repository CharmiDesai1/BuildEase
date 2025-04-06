import React from "react";
import styles from "./InputDesign.module.css";

const DetailRow = ({ label, value, isSmallValue = false }) => {
  return (
    <>
      <div className={styles.detailRow}>
        <div className={styles.detailLabel}>{label}</div>
        <div
          className={
            isSmallValue ? styles.smallDetailValue : styles.detailValue
          }
        >
          {value}
        </div>
      </div>
      <div className={styles.thinDivider} />
    </>
  );
};

const ProfileDetails = ({ details }) => {
  return (
    <section className={styles.profileDetailsSection}>
      <DetailRow
        label="Email account"
        value={details.email}
        isSmallValue={true}
      />
      <DetailRow
        label="Mobile number"
        value={details.mobile}
        isSmallValue={true}
      />
    </section>
  );
};

export default ProfileDetails;