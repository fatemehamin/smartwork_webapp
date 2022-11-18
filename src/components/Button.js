import React from "react";
import "./Button.css";
import loadingImg from "../assets/images/buttonLoading.gif";

export default ({
  label,
  onClick,
  disabled,
  isLoading,
  type = "PRIMARY",
  customStyle,
}) => {
  const styles = {
    text_color: {
      color: disabled ? "#ffffff90" : type == "PRIMARY" ? "#fff" : "#269dd8",
    },
  };

  return (
    <button
      className={`Btn_container Btn_container_${disabled ? "DISABLE" : type}`}
      style={customStyle}
      disabled={disabled}
      onClick={onClick}
    >
      {isLoading && !disabled ? (
        <img className="Btn_loading" src={loadingImg} alt="loading" />
      ) : (
        <h1 className="Btn_text" style={styles.text_color}>
          {label}
        </h1>
      )}
    </button>
  );
};
