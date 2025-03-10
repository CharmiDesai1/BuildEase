import React, { useState } from "react";
import axios from "axios";
import { Input } from "./Input";
import GoogleLoginButton from "./GoogleLoginButton";
import { Link, useNavigate } from "react-router-dom";
import "./styles.css";

export const LoginUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/user/login", formData);
      console.log("User Login Successful:", response.data);
      navigate("/home-user-page");
    } catch (error) {
      console.error("User Login Failed:", error);
      alert("Invalid email or password!");
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
          <h1 className="title">User Login</h1>
          <div className="formFields">
            <Input
              label="Email"
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              label="Password"
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="loginActions">
            <button type="submit" className="loginButton">Login</button>
            <div className="divider">OR</div>
            <div className="socialLogin">
              <GoogleLoginButton redirectTo="/home-user-page" userType="user" />
            </div>
            <p className="signupPrompt">
              Don't have an account yet? <Link to="/signup-user" className="signupLink">Sign up</Link>
            </p>
          </div>
        </form>
        <div className="rightSection">
          <h1 className="title">Your Home, Your Vision</h1>
          <p>Sign in to bring your ideas to life and transform your home.</p>
        </div>
      </div>
    </div>
  );
};