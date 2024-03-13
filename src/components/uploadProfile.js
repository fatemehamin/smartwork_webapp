import React, { useState } from "react";
import AvatarProfile from "./avatarProfile";
import { PhotoCameraOutlined } from "@mui/icons-material";
import { Button } from "@mui/material";
import { addImageUser } from "../features/users/action";
import { useDispatch } from "react-redux";
import "./uploadProfile.css";

const UploadProfile = ({ img, id }) => {
  const [base64Profile, setBase64Profile] = useState(img);

  const dispatch = useDispatch();

  const onChangeProfile = (e) => {
    // if (e.target.files && e.target.files.length > 0) {
    //   setCrop(undefined); // Makes crop preview update between images.
    //   const reader = new FileReader();
    //   reader.readAsDataURL(e.target.files[0]);
    //   reader.addEventListener("load", () =>
    //     setImgSrc(reader.result?.toString() || "")
    //   );
    // }

    // setOpenDialog(true);

    const file = e.target.files[0];
    let reader = new FileReader();
    // // reader.addEventListener("load", () =>
    // //   // setBase64Profile(reader.result?.toString() || "")
    // //   console.log("dsdsd", reader.result?.toString())
    // // );
    reader.readAsDataURL(file);

    // reader.addEventListener("load", () =>
    //   setImgSrc(reader.result?.toString() || "")
    // );

    reader.onload = (event) => {
      setBase64Profile(event.target.result);
      const args = {
        base64Profile: event.target.result,
        profile: file,
        fileName: file.name,
        id,
      };
      dispatch(addImageUser(args));
    };
  };

  return (
    <>
      <Button className="upload-image-container" component="label">
        <AvatarProfile img={base64Profile} isEdit />

        <div className="camera-icon">
          <PhotoCameraOutlined fontSize="small" color="white" />
        </div>
        <input
          type="file"
          accept="image/png, image/gif, image/jpeg"
          style={{ display: "none" }}
          onChange={onChangeProfile}
        />
      </Button>
    </>
  );
};

export default UploadProfile;
