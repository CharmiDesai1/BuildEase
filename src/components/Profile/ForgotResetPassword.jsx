import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./ForgotResetPassword.module.css";

const ForgotResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const developerId = localStorage.getItem("developerId");

  const validatePasswordClient = (password) => {
    const minLength = 12;
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
    const lengthValid = password.length >= minLength;
  
    const errors = [];
  
    if (!lengthValid) errors.push(`At least ${minLength} characters (currently ${password.length}).`);
    if (!hasLowercase) errors.push("Include at least one lowercase letter.");
    if (!hasUppercase) errors.push("Include at least one uppercase letter.");
    if (!hasDigit) errors.push("Include at least one number.");
    if (!hasSpecialChar) errors.push("Include at least one special character.");
  
    return errors;
  };

  const handleSendOTP = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/developers/verify-email", { developerId, email });
      setMessage(response.data.message);
      setIsOtpSent(true);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error sending OTP");
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/developers/verify-otp", { developerId, otp });
      setMessage(response.data.message);
      setIsOtpVerified(true);
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid OTP");
    }
  };

  const handleResetPassword = async () => {
    const validationErrors = validatePasswordClient(newPassword);
    if (validationErrors.length > 0) {
      setMessage("Password error:\n" + validationErrors.join(" "));
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/developers/reset-password", { developerId, newPassword });
      setMessage("Password updated successfully!");
      setTimeout(() => navigate("/developers-landing-page"), 2000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Error updating password";
      setMessage(errorMsg);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Forgot Password</h2>

        {!isOtpSent ? (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />
            <button onClick={handleSendOTP} className={styles.button}>Send OTP</button>
          </>
        ) : (
          <>
            {!isOtpVerified ? (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className={styles.input}
                />
                <button onClick={handleVerifyOTP} className={styles.button}>Verify OTP</button>
              </>
            ) : (
              <>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={styles.input}
                />
                <button onClick={handleResetPassword} className={styles.button}>Reset Password</button>
              </>
            )}
          </>
        )}
        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

export default ForgotResetPassword;