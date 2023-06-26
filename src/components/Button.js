import React from "react";
import "./button.css";
import loadingImg from "../assets/images/buttonLoading.gif";

const Button = ({
  label,
  onClick,
  disabled,
  isLoading,
  type = "PRIMARY",
  customStyle,
}) => {
  return (
    <button
      className={`btn-container btn-container-${disabled ? "DISABLE" : type}`}
      style={customStyle}
      disabled={disabled}
      onClick={onClick}
    >
      {isLoading && !disabled ? (
        <img className="btn-loading" src={loadingImg} alt="loading" />
      ) : (
        <h1
          className={`btn-text btn-text-color-${disabled ? "DISABLE" : type}`}
        >
          {label}
        </h1>
      )}
    </button>
  );
};

export default Button;
