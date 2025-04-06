import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Notification.css";

const Avatar = ({ name, className }) => {
  const initial = name ? name.charAt(0).toUpperCase() : "N";
  return (
    <div className={`avatar ${className || ""}`}>
      <div className="avatarText">{initial}</div>
    </div>
  );
};

const NotificationItem = ({ senderName, message }) => (
  <div className="notificationItem">
    <Avatar name={senderName} />
    <div className="messageContainer">
      <div className="messageText">{message}</div>
    </div>
  </div>
);

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [expanded, setExpanded] = useState(false);
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

      axios.get(`http://localhost:5000/api/notifications/${userId}`)
        .then(response => setNotifications(response.data))
        .catch(error => console.error("Error fetching notifications:", error));
    }
  }, []);

  const toggleExpand = (e) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  return (
    <div className="container">
      <div className="header">
      <Avatar name={userData?.name} className="headerAvatar" />
        <div className="headerTitle">Notifications</div>
      </div>

      <div className={`notificationList ${expanded ? "expanded" : ""}`}>
        {notifications.length > 0 ? (
          notifications.slice(0, expanded ? notifications.length : 3).map((notif, index) => (
            <NotificationItem
              key={index}
              senderName={notif.senderName}
              message={notif.message}
            />
          ))
        ) : (
          <p className="noNotifications">No new notifications</p>
        )}
      </div>

      {notifications.length > 3 && (
        <button className="viewAllButton" onClick={toggleExpand}>
          {expanded ? "Show Less" : "View All"}
        </button>
      )}
    </div>
  );
};

export default Notification;