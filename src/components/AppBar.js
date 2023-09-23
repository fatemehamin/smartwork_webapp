import React, { useState } from "react";
import { AppBar, styled, Typography, Toolbar, IconButton } from "@mui/material";
import { ArrowBackIos, Menu } from "@mui/icons-material/";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Translate } from "../features/i18n/translate";
import Drawer from "./drawer";

const CustomAppBar = ({ label, type = "Menu" }) => {
  const [openDrawer, setOpenDrawer] = useState(false);

  const { language } = useSelector((state) => state.i18n);

  const navigate = useNavigate();

  const handelMenuOrBackBtn = () =>
    type === "Menu" ? setOpenDrawer(true) : navigate(-1);

  const styles = {
    AppBarStyle: styled(AppBar)({
      backgroundColor: "#269dd8",
      zIndex: 2,
    }),
    label: {
      flexGrow: 1,
      mr: 5,
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      overflow: "hidden",
    },
  };

  return (
    <>
      <styles.AppBarStyle position="sticky">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="back"
            onClick={handelMenuOrBackBtn}
          >
            {type === "Menu" ? <Menu /> : <ArrowBackIos />}
          </IconButton>
          <Typography variant="h6" component="div" sx={styles.label}>
            {Translate(label, language) ? Translate(label, language) : label}
          </Typography>
        </Toolbar>
      </styles.AppBarStyle>
      {type === "Menu" && (
        <Drawer
          openDrawer={openDrawer}
          setOpenDrawer={setOpenDrawer}
          CurrentLabel={label === "Smart Work" ? "home" : label}
        />
      )}
    </>
  );
};

export default CustomAppBar;
