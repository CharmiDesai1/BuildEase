import React from "react";

const GoogleLoginButton = () => {
  const handleLogin = () => {
    window.open("http://localhost:5000/auth/google", "_self");
  };

  return (
    <button onClick={handleLogin} className="google-login-btn" style={buttonStyle}>
      <img
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google Logo"
        style={logoStyle}
      />
    </button>
  );
};

const buttonStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#fff",
  border: "1px solid #ddd",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "bold",
};

const logoStyle = {
  width: "20px",
  height: "20px",
};

export default GoogleLoginButton;
