import React, { useState } from "react";
import ImgDrawer from "../assets/images/texture.jpeg";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";
import Alert from "./alert";
import { useDispatch, useSelector } from "react-redux";
import { Translate } from "../features/i18n/translate";
import "./drawer.css";
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
  Dns,
  PlaceOutlined,
  TaskAlt,
  ChatBubbleOutlineOutlined,
  FolderOpenOutlined,
  HomeOutlined,
  ExitToAppOutlined,
} from "@mui/icons-material";

const Drawer = ({ openDrawer, setOpenDrawer, CurrentLabel = "Smart Work" }) => {
  const iOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const position = useSelector((state) => state.auth.type);
  const { language } = useSelector((state) => state.i18n);
  const [logoutAlert, setLogoutAlert] = useState(false);

  const handelLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

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

  const getList = () => {
    return (
      <Box
        className="drawer"
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
        <List>
          <img src={ImgDrawer} className="drawer-img" alt="SmartWorkDrawer" />
          <div className="drawer-label">
            <p className="drawer-text drawer-text-bold">Smart Work</p>
            <p className="drawer-text">v1.1.0</p>
          </div>
          {position === "boss" && (
            <Item
              label="home"
              Icon={HomeOutlined}
              onClick={() => navigate("/manager")}
              CurrentLabel={CurrentLabel}
            />
          )}
          <Item
            label={position === "boss" ? "myTasks" : "home"}
            Icon={TaskAlt}
            onClick={() => navigate("/myTasks")}
            CurrentLabel={CurrentLabel}
          />
          <Item
            label="myReport"
            Icon={ChatBubbleOutlineOutlined}
            onClick={() => navigate("/myReport")}
            CurrentLabel={CurrentLabel}
          />
          {position === "boss" && (
            <>
              {/* <Item label="List of projects" Icon={Dns}  onClick={() => navigate("/listOfProjects")}  /> */}
              <Item
                label="location"
                Icon={PlaceOutlined}
                onClick={() => navigate("/location")}
                CurrentLabel={CurrentLabel}
              />
            </>
          )}
          {(position === "financial" || position === "boss") && (
            <Item
              label="exportExcel"
              Icon={FolderOpenOutlined}
              onClick={() => navigate("/exportExcel")}
              CurrentLabel={CurrentLabel}
            />
          )}
        </List>
        <Divider />
        <List>
          <Item
            label="logout"
            Icon={ExitToAppOutlined}
            onClick={() => setLogoutAlert(true)}
            CurrentLabel={CurrentLabel}
          />
        </List>
        <Alert
          open={logoutAlert}
          setOpen={setLogoutAlert}
          title={Translate("logout", language)}
          description={Translate("logoutDescription", language)}
          Icon={() => <div>icon</div>} // ----------------- not complete --------------
          ButtonAction={[
            { text: Translate("yes", language), onClick: handelLogout },
            { text: Translate("no", language), type: "SECONDARY" },
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
      {getList()}
    </SwipeableDrawer>
  );
};

const Item = ({ label, Icon, onClick, CurrentLabel }) => {
  const { I18nManager, language } = useSelector((state) => state.i18n);
  const styles = { itemIcon: { color: "#33333370", minWidth: 0 } };

  return (
    <ListItem
      disablePadding
      className={`drawer-item ${
        CurrentLabel === label ? "drawer-indicator" : ""
      }`}
    >
      <ListItemButton
        onClick={onClick}
        className={I18nManager.isRTL ? "rtl" : "ltr"}
        style={{ alignItems: "stretch" }}
      >
        <ListItemIcon style={styles.itemIcon}>
          <Icon
            size="small"
            className={
              CurrentLabel === label ? "drawer-item-icon-indicator" : ""
            }
          />
        </ListItemIcon>
        <ListItemText
          primary={Translate(label, language)}
          className={I18nManager.isRTL ? "text-right" : "text-left"}
        />
      </ListItemButton>
    </ListItem>
  );
};

export default Drawer;
