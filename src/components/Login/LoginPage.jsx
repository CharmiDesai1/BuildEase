import React, { useState } from "react";
import axios from "axios";
import { Input } from "./Input";
import GoogleLoginButton from "./GoogleLoginButton";
import { Link, useNavigate } from "react-router-dom";
import "./styles.css";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", formData);
      console.log("Login Successful:", response.data);
  
      const developer = response?.data?.developer;
  
      if (developer && developer.developer_id) {
        localStorage.setItem("developer_id", developer.developer_id);
        console.log("Stored developer_id:", localStorage.getItem("developer_id"));
      } else {
        console.warn("developer_id missing in response!");
      }
      navigate("/developers-landing-page");
    } catch (error) {
      console.error("Login Failed:", error);
      alert("Invalid user or password!");
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
          <h1 className="title">Login to Your Account</h1>
          <div className="formFields">
            <Input
              label="Email"
              type="email"
              id="email"
              name="email"
              placeholder="name@uikit.com"
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
              <GoogleLoginButton />
            </div>
            <p className="signupPrompt">
              Don't have an account yet? <Link to="/signup" className="signupLink">Sign up</Link>
            </p>
          </div>
        </form>
        <div className="rightSection">
          <h1 className="title">Your Home Your Vision</h1>
          <p>Welcome to the platform where your dreams take shape. Sign in to continue and bring your vision to life.</p>
        </div>
      </div>
    </div>
  );
};