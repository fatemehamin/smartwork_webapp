import React, { useState } from "react";
import ImgDrawer from "../assets/images/texture.jpeg";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/action/authAction";
import { useDispatch } from "react-redux";
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
  Button,
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

export default ({
  openDrawer,
  setOpenDrawer,
  position = "boss",
  CurrentLabel = "Smart Work",
}) => {
  const iOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
            <ListItemText primary={label} />
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
          <img src={ImgDrawer} style={styles.img} />
          <div style={styles.labelDrawer}>
            <p style={{ ...styles.text, fontWeight: "bold" }}>Smart Work</p>
            <p style={styles.text}>v1.0.0</p>
          </div>
          {position === "boss" && (
            <Item label="Home" Icon={Home} onClick={() => navigate("/")} />
          )}
          <Item
            label={position === "boss" ? "My Tasks" : "Home"}
            Icon={TaskAlt}
            onClick={() => navigate("/myTasks")}
          />
          <Item
            label="My Report"
            Icon={Assessment}
            onClick={() => navigate("/myReport")}
          />
          {position === "boss" && (
            <>
              <Item
                label="List of projects"
                Icon={Dns}
                onClick={() => navigate("/listOfProjects")}
              />
              <Item
                label="Location"
                Icon={LocationSearching}
                onClick={() => navigate("/location")}
              />
              <Item label="VIP" Icon={Stars} onClick={() => navigate("/VIP")} />
            </>
          )}
          {(position === "financial" || position === "boss") && (
            <Item
              label="Export Excel"
              Icon={InsertDriveFile}
              onClick={() => navigate("/exportExcel")}
            />
          )}
        </List>
        <Divider />
        <List>
          <Item label="Logout" Icon={Alert} onClick={() => setIsAlert(true)} />
        </List>
        <Alert
          open={isAlert}
          setOpen={setIsAlert}
          title="Logout"
          description="Are you sure want to logout?"
          ButtonAction={[
            <Button onClick={() => setIsAlert(false)}>No</Button>,
            <Button onClick={() => dispatch(logout(navigate))} autoFocus>
              Yes
            </Button>,
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
