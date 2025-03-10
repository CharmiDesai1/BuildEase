import React, { useState } from "react";
import axios from "axios";
import { Input } from "./Input";
import GoogleLoginButton from "./GoogleLoginButton";
import { Link, useNavigate } from "react-router-dom";
import "./styles.css";

export const Signup = () => {
  const navigate = useNavigate();
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.password) {
      alert("All fields are required!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/signup", formData);
      alert("Signup Successful!");
      navigate("/developers-landing-page");
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Signup Failed! Please try again.");
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
              <Link to="/" className="LoginLink">
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
