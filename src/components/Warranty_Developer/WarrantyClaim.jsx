import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./WarrantyClaim.css";

const WarrantyClaim = () => {
  const [developerId, setDeveloperId] = useState(null);
  const [warrantyData, setWarrantyData] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedDeveloperId = localStorage.getItem("developerId");
    const storedWarrantyClaimId = localStorage.getItem("warrantyClaimId");

    if (storedDeveloperId && storedWarrantyClaimId) {
      console.log("✅ Developer ID:", storedDeveloperId);
      console.log("✅ Warranty Claim ID:", storedWarrantyClaimId);
      setDeveloperId(storedDeveloperId);
      fetchWarrantyClaim(storedWarrantyClaimId);
    } else {
      console.error("❌ Missing Developer ID or Warranty Claim ID in localStorage.");
    }
  }, []);

  const fetchWarrantyClaim = async (warrantyClaimId) => {
    try {
      console.log("📡 Fetching warranty claim details...");
      const response = await axios.get(`http://localhost:5000/api/warranty-claim/${warrantyClaimId}`);
      console.log("✅ Warranty claim data retrieved:", response.data);
      setWarrantyData(response.data);
    } catch (error) {
      console.error("❌ Error fetching warranty claim data:", error);
    }
  };

  // Fix: Always use useEffect without conditions inside it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Runs once on mount

  const updateApprovalStatus = async (status) => {
    if (!warrantyData) return;

    try {
      console.log(`🔄 Updating status to ${status}...`);

      await axios.put(
        `http://localhost:5000/api/warranty-claim/${warrantyData.id}/status`,
        { status },
        { headers: { "Content-Type": "application/json" } }
      );
      setWarrantyData((prev) => ({ ...prev, approval_status: status }));
      console.log(`✅ Status updated to ${status}`);
      setShowDropdown(false);
    } catch (error) {
      console.error("❌ Error updating approval status:", error);
    }
  };

  if (!warrantyData) {
    return <div className="loading">Loading Warranty Claim Details...</div>;
  }

  return (
    <div className="form-container">
      <h2>Warranty Claim Details</h2>
      <form>
        <label>Property</label>
        <input type="text" value={warrantyData.project_name} readOnly />

        <label>Category</label>
        <input type="text" value={warrantyData.category} readOnly />

        <label>Name</label>
        <input type="text" value={warrantyData.name} readOnly />

        <label>Email</label>
        <input type="email" value={warrantyData.email} readOnly />

        <label>Description of Issues</label>
        <textarea value={warrantyData.description} readOnly></textarea>

        <label>Uploaded Image</label>
        <div className="image-container">
          {warrantyData.image_path ? (
            <img 
              src={`http://localhost:5000${warrantyData.image_path}`} 
              alt="Warranty Issue" 
              className="uploaded-image"
            />
          ) : (
            <p>No image uploaded</p>
          )}
        </div>

        <label>Date of Possession</label>
        <input type="text" value={warrantyData.date_of_possession} readOnly />

        <label>Preferred Resolution Type</label>
        <input type="text" value={warrantyData.resolution_type} readOnly />

        {warrantyData.resolutionType === "others" && (
          <>
            <label>Other Resolution</label>
            <input type="text" value={warrantyData.other_resolution} readOnly />
          </>
        )}
      </form>
      <div className="button-group">
        <button className="btn request-info" onClick={() => updateApprovalStatus("Request more info")}>
          Request more info
        </button>
        <button className="btn reject" onClick={() => updateApprovalStatus("Reject Claim")}>
          Reject claim
        </button>
        <div className="dropdown" ref={dropdownRef}>
          <button className="btn approve" onClick={() => setShowDropdown(!showDropdown)}>
            Approve and:
          </button>
          {showDropdown && (
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={() => updateApprovalStatus("Approved and Assign to technician")}>
                Assign to technician
              </button>
              <button className="dropdown-item" onClick={() => updateApprovalStatus("Approved and Schedule an inspection")}>
                Schedule an inspection
              </button>
              <button className="dropdown-item" onClick={() => updateApprovalStatus("Close case")}>
                Close Case
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WarrantyClaim;
