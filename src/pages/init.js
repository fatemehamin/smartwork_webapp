import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import launchScreenP from "../assets/images/launch_screen.svg";
import launchScreenL from "../assets/images/launch_screen_land.svg";

const Init = () => {
  const navigate = useNavigate();

  const { accessToken, type } = useSelector((state) => state.auth);

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const orientation =
    windowSize.width > windowSize.height ? "Landscape" : "Portrait";

  useEffect(() => {
    setTimeout(() => {
      navigate(
        accessToken === null
          ? "/login"
          : type === "boss"
          ? "/manager"
          : "/myTasks"
      );
    }, 1000);

    const updateWindowDimensions = () =>
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });

    window.addEventListener("resize", updateWindowDimensions);
    return () => window.removeEventListener("resize", updateWindowDimensions);
  }, [accessToken, navigate, type]);

  const styles = {
    container: {
      height: window.innerHeight,
      width: "100%",
      display: "flex",
      alignContent: "center",
      justifyContent: "center",
    },
    img: {
      width:
        orientation === "Landscape"
          ? (windowSize.height / 2) * 3
          : windowSize.width,
      height:
        orientation === "Landscape"
          ? windowSize.height
          : (windowSize.width / 2) * 3,
    },
  };

  return (
    <div style={styles.container}>
      <img
        src={orientation === "Landscape" ? launchScreenL : launchScreenP}
        style={styles.img}
        alt="Splash screen"
      />
    </div>
  );
};

export default Init;
