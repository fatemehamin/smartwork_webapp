import React, { useEffect, useState, useRef } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import { AppBar, Button, Dialog, Typography } from "@mui/material";
import { CheckRounded, Close, PhotoCameraOutlined } from "@mui/icons-material";
import { Translate } from "../features/i18n/translate";
import { useSelector } from "react-redux";
import { useSnackbar } from "react-simple-snackbar";
import AvatarProfile from "./avatarProfile";
import "./uploadProfile.css";
import "react-image-crop/dist/ReactCrop.css";

const UploadProfile = ({ img, setImg }) => {
  //{x: 0, y: 0, width: 300, height: 300, unit: "px", // Can be 'px' or '%' }
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(undefined);
  const [openDialog, setOpenDialog] = useState(false);
  const [imgSrc, setImgSrc] = useState(undefined);
  const [imgName, setImgName] = useState("");

  const [openSnackbar] = useSnackbar();

  const { language } = useSelector((state) => state.i18n);

  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const blobUrlRef = useRef("");

  const onChangeProfile = (e) => {
    const file = e.target.files[0];
    if (file) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        // if don't need crop just send file(this file is bindery) to the backend
        // setImg({ base64: event.target.result, file });

        setImgSrc(event.target.result);
        setImgName(file.name);
      };
    } else {
      handleClose();
    }
  };

  const handleOpen = (e) => setOpenDialog(true);

  const handleClose = () => {
    setOpenDialog(false);
    setCrop(undefined);
    setCompletedCrop(undefined);
  };

  const centerAspectCrop = (mediaWidth, mediaHeight) => {
    return centerCrop(
      makeAspectCrop({ unit: "%", width: 90 }, 1, mediaWidth, mediaHeight),
      mediaWidth,
      mediaHeight
    );
  };

  const onImageLoadForEdit = (e) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height));
  };

  const onDownloadCropClick = async () => {
    const image = imgRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!image || !previewCanvas || !completedCrop) {
      openSnackbar(Translate("noImage", language));
    } else {
      // This will size relative to the uploaded image
      // size. If you want to size according to what they
      // are looking at on screen, remove scaleX + scaleY
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      const offscreen = new OffscreenCanvas(
        completedCrop.width * scaleX,
        completedCrop.height * scaleY
      );

      const ctx = offscreen.getContext("2d");

      if (!ctx) {
        throw new Error("No 2d context");
      }

      ctx.drawImage(
        previewCanvas,
        0,
        0,
        previewCanvas.width,
        previewCanvas.height,
        0,
        0,
        offscreen.width,
        offscreen.height
      );

      const blob = await offscreen.convertToBlob({
        type: "image/png",
      });

      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }

      blobUrlRef.current = URL.createObjectURL(blob);

      fetch(blobUrlRef.current)
        .then((response) => response.blob())
        .then((blob) => {
          setImg({ base64: blobUrlRef.current, fileName: imgName, file: blob });
          handleClose();
        });
    }
  };

  const canvasPreview = async (image, canvas, crop) => {
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No 2d context");
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    // devicePixelRatio slightly increases sharpness on retina devices
    // at the expense of slightly slower render times and needing to
    // size the image back down if you want to download/upload and be
    // true to the images natural size.
    const pixelRatio = window.devicePixelRatio;
    // const pixelRatio = 1

    canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
    canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = "high";

    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;

    ctx.save();

    // Move the crop origin to the canvas origin (0,0)
    ctx.translate(-cropX, -cropY);

    ctx.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight
    );

    ctx.restore();
  };

  useEffect(() => {
    if (
      completedCrop?.width &&
      completedCrop?.height &&
      imgRef.current &&
      previewCanvasRef.current
    ) {
      canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop);
    }
  }, [completedCrop]);

  return (
    <>
      <Button className="upload-image-container" component="label">
        <AvatarProfile img={img} isEdit />

        <div className="camera-icon">
          <PhotoCameraOutlined fontSize="small" color="white" />
        </div>

        <input
          type="file"
          accept="image/png, image/gif, image/jpeg"
          style={{ display: "none" }}
          onChange={onChangeProfile}
          onClick={handleOpen}
        />
      </Button>

      <Dialog fullScreen open={openDialog} onClose={handleClose}>
        <AppBar className="appBar">
          <Close onClick={handleClose} className="icon" />

          <Typography className="titleAppBar" variant="h6" component="div">
            {Translate("editPhoto", language)}
          </Typography>

          <CheckRounded onClick={onDownloadCropClick} className="icon" />
        </AppBar>

        <div className="cropContainer">
          {!!imgSrc && (
            <ReactCrop
              crop={crop}
              onChange={setCrop}
              onComplete={setCompletedCrop}
              aspect={1}
              circularCrop
            >
              <img
                ref={imgRef}
                src={imgSrc}
                alt="corp image"
                style={{ maxHeight: (3 * window.screen.height) / 4 }}
                onLoad={onImageLoadForEdit}
              />
            </ReactCrop>
          )}
        </div>

        <canvas ref={previewCanvasRef} className="canvas" />
      </Dialog>
    </>
  );
};

export default UploadProfile;
