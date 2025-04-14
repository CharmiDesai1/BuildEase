import React, { useState } from "react";
import axios from "axios";
import { Input } from "./Input";
import GoogleLoginButton from "./GoogleLoginButton";
import { Link, useNavigate } from "react-router-dom";
import "./styles.css";

export const SignupUser = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.password) {
      alert("All fields are required!");
      return;
    }
    const validationErrors = validatePasswordClient(formData.password);
    if (validationErrors.length > 0) {
      setMessage("Password error:\n" + validationErrors.join(" "));
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/signup-user", formData);
      console.log("Signup response:", response.data);
      alert("Signup Successful!");
      navigate("/home-user-page");
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Error updating password";
      setMessage(errorMsg);
    }
  };

  return (
    <div className="pageContainer">
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/0c2542db9cfa6a76292d8bda2844573c56242a2db6bcb80819f7ff34890e76f2?apiKey=5ff77f35f86848e08538b31b55934505&"
        className="backgroundImage"
        alt="background"
      />
      <div className="contentWrapper">
        <form className="loginContainer" onSubmit={handleSubmit}>
          <h1 className="title">Create an Account</h1>
          <div className="formFields">
            <Input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {message && <p className="message">{message}</p>}
          </div>
          <div className="loginActions">
            <button type="submit" className="loginButton">
              Sign Up
            </button>
            <div className="divider">OR</div>
            <div className="socialLogin">
              <GoogleLoginButton />
            </div>
            <p className="signupPrompt">
              Already have an Account?{" "}
              <Link to="/login-user" className="LoginLink">
                Login
              </Link>
            </p>
          </div>
        </form>
        <div className="rightSection">
          <h1 className="title">Your Home Your Vision</h1>
          <p>
            Welcome to the platform where your dreams take shape. Sign in to
            continue and bring your vision to life.
          </p>
        </div>
      </div>
    </div>
  );
};
