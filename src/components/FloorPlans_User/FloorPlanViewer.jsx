import React from "react";
import styles from "./FloorPlanUser.module.css";

export const FloorPlanViewer = () => {
  return (
    <section className={styles.floorPlanViewer}>
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/e141cbda78ccd0fa8fa3f2181c4e7ef8970b4e920ffe31cf025bf59e3d86a6b1?placeholderIfAbsent=true&apiKey=91e3b54116b2400fa8bdb6a04bd22a0c"
        alt="Floor plan"
        className={styles.floorPlanImage}
      />
      <div className={styles.viewerControls}>
        <article className={styles.floorPlanCard}>
          <h2 className={styles.floorplanTitle}>
            Floor plan for Shridhar Athens
          </h2>
          <div className={styles.planContent}>
            <div className={styles.planDetails}>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/68db150dd77d6481d11f2195beb10f35d5fe040a1e2b5363dc3acd7005a08696?placeholderIfAbsent=true&apiKey=91e3b54116b2400fa8bdb6a04bd22a0c"
                alt="Floor plan details"
                className={styles.planDetailImage}
              />
              <div className={styles.iconGroup}>
                <div className={styles.iconContainer}>
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/52c10f8df7721feb637acb3680200383ac113ca5d338c34005966139acbec584?placeholderIfAbsent=true&apiKey=91e3b54116b2400fa8bdb6a04bd22a0c"
                    alt="Icon 1"
                    className={styles.featureIcon}
                  />
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/80688e20c99654461679cd7ae29efd559203262a3f0c1994dd3a8becab575964?placeholderIfAbsent=true&apiKey=91e3b54116b2400fa8bdb6a04bd22a0c"
                    alt="Icon 2"
                    className={styles.featureIcon}
                  />
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/514361d0cfb8e582b690521e324bd35662150ac7ad8c9fd9e4828a08edca9981?placeholderIfAbsent=true&apiKey=91e3b54116b2400fa8bdb6a04bd22a0c"
                    alt="Icon 3"
                    className={styles.featureIcon}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.commentContainer}>
          <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/5b5fb50b718b7d632896c7601fcd04bb4fb5f599fda9a1e687611fe47639b965?placeholderIfAbsent=true&apiKey=91e3b54116b2400fa8bdb6a04bd22a0c"
        alt="Comment icon"
        className={styles.commentIcon}
      />
        <div className={styles.commentInput}>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/c5fa0594be0fb4028ed16a53e2acea87d452e390b3c5fc3552783e0b5fb4d5a5?placeholderIfAbsent=true&apiKey=91e3b54116b2400fa8bdb6a04bd22a0c"
            alt="Input icon"
            className={styles.inputIcon}
          />
          <textarea
            placeholder="Add a comment"
            className={styles.commentTextarea}
            rows={2}
          />
        </div>
        <button className={styles.sendButton}>
          <span className={styles.sendText}>SEND</span>
        </button>
        </div>
        </article>
      </div>
    </section>
  );
};
