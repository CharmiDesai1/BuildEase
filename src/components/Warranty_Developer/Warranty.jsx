import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Warranty.css";
import { useNavigate } from "react-router-dom";

const Avatar = ({ name, className }) => {
  const initial = name ? name.charAt(0).toUpperCase() : "N";
  return (
    <div className={`avatar ${className || ""}`}>
      <div className="avatarText">{initial}</div>
    </div>
  );
};

const WarrantyClaim = ({ senderName, message, onView }) => (
  <div className="warrantyClaim">
    <Avatar name={senderName} />
    <div className="messageContainer">
      <div className="messageText">{message}</div>
      <button className="viewButton" onClick={onView}>View</button>
    </div>
  </div>
);

const Warranty = () => {
  const navigate = useNavigate();
  const [warranty, setWarranty] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [developerData, setDeveloperData] = useState(null);
  const [selectedWarranty, setSelectedWarranty] = useState(null);

  useEffect(() => {
    const developerId = localStorage.getItem("developerId");
    if (developerId) {
      fetch(`http://localhost:5000/api/developer/${developerId}`)
        .then(res => res.json())
        .then(data => {
          setDeveloperData({
            name: data.full_name,
            details: {
              email: data.email,
            },
          });
        })
        .catch(err => console.error("Failed to fetch developer data:", err));
      axios.get(`http://localhost:5000/api/warranty/developer/${developerId}`)
        .then(response => setWarranty(response.data))
        .catch(error => console.error("❌ Error fetching Warranty Claimss:", error));
    }
  }, []);

  const toggleExpand = (e) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  const handleView = (warranty) => {
    setSelectedWarranty(warranty);
    localStorage.setItem("warrantyClaimId", warranty.id);
    console.log("✅ Stored warranty Claim:", warranty.id);
    navigate("/warranty-claim-developer");
  };

  const closeModal = () => {
    setSelectedWarranty(null);
  };

  return (
    <div className="container">
      <div className="header">
        <Avatar name={developerData?.name} className="headerAvatar" />
        <div className="headerTitle">Warranty Claims</div>
      </div>

      <div className={`WarrantyList ${expanded ? "expanded" : ""}`}>
        {warranty.length > 0 ? (
          warranty.slice(0, expanded ? warranty.length : 3).map((notif, index) => (
            <WarrantyClaim
              key={index}
              senderName={notif.senderName}
              message={notif.message}
              onView={() => handleView(notif)}
            />
          ))
        ) : (
          <p className="noWarranty">No new Warranty Claims</p>
        )}
      </div>

      {warranty.length > 3 && (
        <button className="viewAllButton" onClick={toggleExpand}>
          {expanded ? "Show Less" : "View All"}
        </button>
      )}

      {selectedWarranty && (
        <div className="modal">
          <div className="modalContent">
            <h2>Warranty Details</h2>
            <p><strong>Sender:</strong> {selectedWarranty.senderName}</p>
            <p><strong>Message:</strong> {selectedWarranty.message}</p>
            <p><strong>Description:</strong> {selectedWarranty.description}</p>
            <button className="closeButton" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Warranty;