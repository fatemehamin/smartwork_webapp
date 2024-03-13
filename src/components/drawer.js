import React, { useState, useEffect } from "react";
import ImgDrawer from "../assets/images/texture.png";
import TokenChecker from "../components/tokenChecker";
import ChangeLanguageBtn from "../components/changeLanguageBtn";
import Alert from "./alert";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Translate } from "../features/i18n/translate";
import { checkType } from "../features/auth/action";
import { ReactComponent as LogoutIcon } from "../assets/icons/logout.svg";
import { deleteFcmToken } from "../features/notification/action";
import { getLanguage } from "../features/i18n/action";
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
  FmdGood,
  TaskAlt,
  ChatBubble,
  Folder,
  Home,
  Language,
  ExitToAppOutlined,
  AccessTime,
} from "@mui/icons-material";

const Drawer = ({ openDrawer, setOpenDrawer, CurrentLabel = "Smart Work" }) => {
  const iOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const position = useSelector((state) => state.auth.type);
  const { id } = useSelector((state) => state.notification);

  const [openAlert, setOpenAlert] = useState(false);
  const [alertType, setAlertType] = useState("language");

  const admin = position === "boss" || position === "admin";

  const openAlertLogout = () => {
    setOpenAlert(true);
    setAlertType("logout");
  };

  const openAlertChangeLanguage = () => {
    setOpenAlert(true);
    setAlertType("language");
  };

  useEffect(() => {
    dispatch(checkType());
    dispatch(getLanguage());
  }, []);

  const handleLogout = () => {
    dispatch(deleteFcmToken(id));
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

  const alert = {
    language: {
      description: "languageDescription",
      Icon: () => <Language color="secondary" fontSize="large" />,
    },
    logout: {
      title: "logout",
      description: "logoutDescription",
      Icon: LogoutIcon,
      ButtonAction: [
        { text: "yes", onClick: handleLogout },
        { text: "no", type: "SECONDARY" },
      ],
    },
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
            <p className="drawer-text">v1.1.4</p>
          </div>
          <div className="drawer-p5">
            {admin && (
              <Item
                label="home"
                Icon={Home}
                onClick={() => navigate("/manager")}
                CurrentLabel={CurrentLabel}
              />
            )}
            <Item
              label={admin ? "myTasks" : "home"}
              Icon={admin ? TaskAlt : Home}
              onClick={() => navigate("/myTasks")}
              CurrentLabel={CurrentLabel}
            />
            <Item
              label="myReport"
              Icon={ChatBubble}
              onClick={() => navigate("/myReport")}
              CurrentLabel={CurrentLabel}
            />
            {admin && (
              <>
                {/* <Item label="List of projects" Icon={Dns}  onClick={() => navigate("/listOfProjects")}  /> */}
                <Item
                  label="location"
                  Icon={FmdGood}
                  onClick={() => navigate("/location")}
                  CurrentLabel={CurrentLabel}
                />
                <Item
                  label="shiftWork"
                  Icon={AccessTime}
                  onClick={() => navigate("/shiftWork")}
                  CurrentLabel={CurrentLabel}
                />
              </>
            )}
            {(position === "financial" || admin) && (
              <Item
                label="exportExcel"
                Icon={Folder}
                onClick={() => navigate("/exportExcel")}
                CurrentLabel={CurrentLabel}
              />
            )}
            <Divider />
            <Item
              label="language"
              Icon={Language}
              onClick={openAlertChangeLanguage}
              CurrentLabel={CurrentLabel}
            />
            <Item
              label="logout"
              Icon={ExitToAppOutlined}
              onClick={openAlertLogout}
              CurrentLabel={CurrentLabel}
            />
          </div>
        </List>
        <Alert open={openAlert} setOpen={setOpenAlert} {...alert[alertType]}>
          {alertType === "language" && <ChangeLanguageBtn />}
        </Alert>
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
      <TokenChecker />
      {getList()}
    </SwipeableDrawer>
  );
};

const Item = ({ label, Icon, onClick, CurrentLabel }) => {
  const { language } = useSelector((state) => state.i18n);

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
        className="direction"
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
          className="text-align"
        />
      </ListItemButton>
    </ListItem>
  );
};

export default Drawer;
