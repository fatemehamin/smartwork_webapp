import React from "react";
import { CircularProgress } from "@mui/material";

export default ({ isLoading }) => {
  return isLoading ? (
    <div style={styles.container}>
      <div style={styles.loading}>
        <CircularProgress color="white" />
        <p style={{ color: "#fff" }}>Loading</p>
      </div>
    </div>
  ) : null;
};

const styles = {
  container: {
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    backgroundColor: "#00000090",
    position: "fixed",
    zIndex: 5,
    width: "100%",
    height: "100%",
  },
  loading: {
    backgroundColor: "#00000090",
    width: 100,
    height: 100,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    padding: 10,
  },
};
