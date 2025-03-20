import React, { useEffect, useState } from "react";
import styles from "./DeveloperUpdateForm.module.css"; // Import CSS file

const DeveloperUpdateForm = () => {
  const [propertyId, setPropertyId] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [formData, setFormData] = useState({
    planning_permit_date: "",
    site_preparation_date: "",
    structural_utility_date: "",
    interior_exterior_date: "",
    possession_handover_date: "",
  });

  useEffect(() => {
    const storedPropertyId = localStorage.getItem("propertyId");
    if (storedPropertyId) {
      setPropertyId(parseInt(storedPropertyId, 10));
      fetchProjectName(parseInt(storedPropertyId, 10));
    } else {
      console.warn("⚠️ No property ID found in localStorage.");
    }
  }, []);

  const fetchProjectName = async (propertyId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/get-project-name?propertyId=${propertyId}`);
      const data = await response.json();
      if (response.ok) {
        setProjectName(data.project_name);
      } else {
        console.error("❌ Error fetching project name:", data.message);
      }
    } catch (error) {
      console.error("❌ Failed to fetch project name:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!propertyId) {
      alert("No property selected!");
      return;
    }
    const updatedData = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value !== "")
    );
  
    if (Object.keys(updatedData).length === 0) {
      alert("No fields updated!");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/update-timeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId, ...updatedData }),
      });
  
      if (response.ok) {
        alert("✅ Project details updated successfully!");
        window.location.href = "/floor-plan-page";
      } else {
        alert("❌ Failed to update project details.");
      }
    } catch (error) {
      console.error("❌ Error updating project details:", error);
    }
  };  

  return (
    <div className={styles["form-container"]}>
      <h2>Update Project Timeline for <span className={styles.projectName}>{projectName || "Loading..."}</span></h2>
      <form onSubmit={handleSubmit}>
        <div className={styles["form-group"]}>
          <label>Planning and Permit Date:</label>
          <input type="date" name="planning_permit_date" value={formData.planning_permit_date} onChange={handleChange}/>
        </div>

        <div className={styles["form-group"]}>
          <label>Site Preparation Date:</label>
          <input type="date" name="site_preparation_date" value={formData.site_preparation_date} onChange={handleChange}/>
        </div>

        <div className={styles["form-group"]}>
          <label>Structural & Utility Installation Date:</label>
          <input type="date" name="structural_utility_date" value={formData.structural_utility_date} onChange={handleChange}/>
        </div>

        <div className={styles["form-group"]}>
          <label>Interior & Exterior Finishing Date:</label>
          <input type="date" name="interior_exterior_date" value={formData.interior_exterior_date} onChange={handleChange}/>
        </div>

        <div className={styles["form-group"]}>
          <label>Possession & Handover Date:</label>
          <input type="date" name="possession_handover_date" value={formData.possession_handover_date} onChange={handleChange}/>
        </div>

        <button className={styles["submit-button"]} type="submit">Update Timeline</button>
      </form>
    </div>
  );
};

export default DeveloperUpdateForm;
