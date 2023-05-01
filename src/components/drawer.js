import React, { useState } from "react";
import ImgDrawer from "../assets/images/texture.jpeg";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/action/authAction";
import Alert from "./Alert";
import {
  Box,
  SwipeableDrawer,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Stars,
  LocationSearching,
  TaskAlt,
  Assessment,
  InsertDriveFile,
  Dns,
  Home,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { Translate } from "../i18n";

const Drawer = ({ openDrawer, setOpenDrawer, CurrentLabel = "Smart Work" }) => {
  const iOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const position = useSelector((state) => state.authReducer.type);
  const { language, I18nManager } = useSelector((state) => state.configReducer);
  const [isAlert, setIsAlert] = useState(false);
  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpenDrawer(open);
  };
  const list = () => {
    const Item = ({ label, Icon, onClick }) => {
      return (
        <ListItem
          disablePadding
          style={{
            backgroundColor: CurrentLabel == label && "#f6921e20",
            color: CurrentLabel == label ? "#f6921e" : "#777777",
            ...styles.list,
          }}
        >
          <ListItemButton onClick={onClick}>
            {/* <ListItemIcon style={{ color: CurrentLabel == label && "#f6921e" }}>
              <Icon size="small" />
            </ListItemIcon> */}
            <ListItemText
              primary={label}
              style={{ textAlign: I18nManager.isRTL ? "right" : "left" }}
            />
          </ListItemButton>
        </ListItem>
      );
    };
    return (
      <Box
        sx={styles.drawer}
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
        <List>
          <img src={ImgDrawer} style={styles.img} alt="SmartWorkDrawer" />
          <div style={styles.labelDrawer}>
            <p style={{ ...styles.text, fontWeight: "bold" }}>Smart Work</p>
            <p style={styles.text}>v1.1.0</p>
          </div>
          {position === "boss" && (
            <Item
              label={Translate("home", language)}
              Icon={Home}
              onClick={() => navigate("/manager")}
            />
          )}
          <Item
            label={Translate(
              position === "boss" ? "myTasks" : "home",
              language
            )}
            Icon={TaskAlt}
            onClick={() => navigate("/myTasks")}
          />
          <Item
            label={Translate("myReport", language)}
            Icon={Assessment}
            onClick={() => navigate("/myReport")}
          />
          {position === "boss" && (
            <>
              {/* <Item
                label="List of projects"
                Icon={Dns}
                onClick={() => navigate("/listOfProjects")}
              /> */}
              <Item
                label={Translate("location", language)}
                Icon={LocationSearching}
                onClick={() => navigate("/location")}
              />
              {/* <Item label="VIP" Icon={Stars} onClick={() => navigate("/VIP")} /> */}
            </>
          )}
          {(position === "financial" || position === "boss") && (
            <Item
              label={Translate("exportExcel", language)}
              Icon={InsertDriveFile}
              onClick={() => navigate("/exportExcel")}
            />
          )}
        </List>
        <Divider />
        <List>
          <Item
            label={Translate("logout", language)}
            Icon={Alert}
            onClick={() => setIsAlert(true)}
          />
        </List>
        <Alert
          open={isAlert}
          setOpen={setIsAlert}
          title={Translate("logout", language)}
          description={Translate("logoutDescription", language)}
          ButtonAction={[
            { text: Translate("no", language) },
            {
              text: Translate("yes", language),
              onClick: () => dispatch(logout(navigate)),
            },
          ]}
        />
      </Box>
    );
  };
  return (
    <SwipeableDrawer
      anchor="left"
      open={openDrawer}
      onClose={toggleDrawer(false)}
      onOpen={toggleDrawer(true)}
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
    >
      {list()}
    </SwipeableDrawer>
  );
};

const styles = {
  drawer: { width: 250 },
  img: { height: 210, width: "100%", marginTop: -8 },
  labelDrawer: {
    position: "absolute",
    backgroundColor: "#00000060",
    height: 60,
    width: "100%",
    top: 150,
    paddingLeft: 10,
  },
  text: { color: "#fff", lineHeight: 0.25 },
  list: { borderRadius: 5, width: 230, marginLeft: 10 },
};

export default Drawer;
