import React, { useState } from "react";
import { AppBar, styled, Typography, Toolbar, IconButton } from "@mui/material";
import { ArrowBackIos, Menu } from "@mui/icons-material/";
import { useNavigate } from "react-router-dom";
import Drawer from "./drawer";

export default ({ label, type = "Menu", position }) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const navigate = useNavigate();
  return (
    <>
      <styles.AppBarStyle position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="back"
            onClick={() =>
              type === "Menu" ? setOpenDrawer(true) : navigate(-1)
            }
          >
            {type == "Menu" ? <Menu /> : <ArrowBackIos />}
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, mr: 5 }}>
            {label}
          </Typography>
        </Toolbar>
      </styles.AppBarStyle>
      <Drawer
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
        CurrentLabel={label == "Smart Work" ? "Home" : label}
        position={position}
      />
    </>
  );
};
const styles = {
  AppBarStyle: styled(AppBar)({
    backgroundColor: "#269dd8",
  }),
};
