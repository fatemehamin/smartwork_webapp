import React from "react";
import { ReactComponent as Avatar } from "../assets/icons/avatar.svg";
import "./uploadProfile.css";

const AvatarProfile = ({ img, isEdit }) => {
  return img ? (
    <img
      className={`user-avatar${isEdit ? "-edit" : ""}`}
      src={img}
      alt="avatar"
    />
  ) : (
    <Avatar className={isEdit ? "user-avatar-edit" : "user-avatar"} />
  );
};

export default AvatarProfile;
