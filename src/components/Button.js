import React from "react";
import "./button.css";
import loadingImg from "../assets/images/buttonLoading.gif";
import { animated } from "@react-spring/web";

const Button = ({
  label,
  onClick,
  disabled,
  isLoading,
  type = "PRIMARY",
  customStyle,
}) => {
  return (
    <animated.button
      className={`btn-container btn-container-${
        disabled || isLoading ? "DISABLE" : type
      }`}
      style={customStyle}
      disabled={disabled || isLoading}
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
    </animated.button>
  );
};

export default Button;
