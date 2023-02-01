import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { init } from "../redux/action/authAction";
import launchScreenP from "../assets/images/launch_screen.jpg";
import launchScreenL from "../assets/images/launch_screen_land.jpg";

export default () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const orientation =
    windowSize.width > windowSize.height ? "Landscape" : "Portrait";

  useEffect(() => {
    setTimeout(() => {
      dispatch(init(navigate));
    }, 1000);
    const updateWindowDimensions = () =>
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    window.addEventListener("resize", updateWindowDimensions);
    return () => window.removeEventListener("resize", updateWindowDimensions);
  }, []);
  return (
    <div
      style={{
        width: "100%",
        height: window.innerHeight,
        display: "flex",
        alignContent: "center",
        justifyContent: "center",
      }}
    >
      <img
        src={orientation == "Landscape" ? launchScreenL : launchScreenP}
        style={{
          width:
            orientation == "Landscape"
              ? (windowSize.height / 2) * 3
              : windowSize.width,
          height:
            orientation == "Landscape"
              ? windowSize.height
              : (windowSize.width / 2) * 3,
        }}
      />
    </div>
  );
};
