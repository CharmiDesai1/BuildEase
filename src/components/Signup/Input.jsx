import React from "react";
import "./styles.css";

export const Input = ({ label, type = "text", placeholder, id, name, value, onChange, required }) => {
  return (
    <div className="inputWrapper">
      <label htmlFor={id} className="label">
        {label}
      </label>
      <div className="inputContainer">
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className="input"
          placeholder={placeholder}
          aria-label={label}
          required={required}
        />
      </div>
    </div>
  );
};