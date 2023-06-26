// import React, { useEffect, useState } from "react";
// import { CircularProgress } from "@mui/material";
// export default ({ isLoading }) => {
//   const [Window, setWindow] = useState({
//     width: 0,
//     height: 0,
//   });
//   useEffect(() => {
//     setWindow({ width: window.innerWidth, height: window.innerHeight });
//   }, [window.innerWidth, window.innerHeight]);
//   console.log(Window);
//   return isLoading ? (
//     <div
//       style={{
//         ...styles.container,
//         width: Window.width,
//         height: Window.height,
//       }}
//     >
//       <div style={styles.loading}>
//         <CircularProgress color="white" />
//         <p style={{ color: "#fff" }}>Loading</p>
//       </div>
//     </div>
//   ) : null;
// };
// const styles = {
//   container: {
//     alignItems: "center",
//     justifyContent: "center",
//     display: "flex",
//     backgroundColor: "#00000090",
//     // position: "absolute",
//     zIndex: 5,
//   },
//   loading: {
//     backgroundColor: "#00000090",
//     width: 100,
//     height: 100,
//     borderRadius: 10,
//     alignItems: "center",
//     justifyContent: "center",
//     // display: "flex",
//   },
// };
