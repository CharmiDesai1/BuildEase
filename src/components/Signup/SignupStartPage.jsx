import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";

export const SignupStartPage = () => {
  return (
    <div className="pageContainer">
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/0c2542db9cfa6a76292d8bda2844573c56242a2db6bcb80819f7ff34890e76f2?apiKey=5ff77f35f86848e08538b31b55934505&"
        className="backgroundImage"
        alt="background"
      />
      <div className="centerContent">
        <h1 className="mainTitle">Your Home Your Vision</h1>
      <div className="contentWrapper">
        <form className="loginContainer">
          <h1 className="title">Create Account</h1>
          <div className="loginActions">
            <button type="submit" className="loginButton">
            <Link to="/signup" className="signupLink">SignUp as Developer</Link></button>
            <div className="divider">OR</div>
            <button type="submit" className="loginButton"> 
            <Link to="/signup-user" className="signupLink">SignUp as Customer</Link></button>
            <p className="signupPrompt">
              Already an account yet? <Link to="/" className="signupLink">Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};
