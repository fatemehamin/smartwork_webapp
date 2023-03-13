import React, { useState, useEffect } from "react";
import AppBar from "../components/AppBar";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import Button from "../components/Button";
import Modal from "../components//modal";
import { Room, Delete, RadioButtonUnchecked } from "@mui/icons-material";
import { useSnackbar } from "react-simple-snackbar";
import { useDispatch, useSelector } from "react-redux";
import { addLocation, DeleteLocation } from "../redux/action/managerAction";
import Alert from "../components/Alert";
import Input from "../components/Input";
import Icon from "../assets/images/marker-icon-2x-gold.png";
import L from "leaflet";
import LocateControl from "../utils/locatecontrol";

const Location = () => {
  const stateManager = useSelector((state) => state.managerReducer);
  const dispatch = useDispatch();
  const [openSnackbar, closeSnackbar] = useSnackbar();
  const [locations, setLocations] = useState([]);
  const [isPress, setIsPress] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [deleteLocation, setDeleteLocation] = useState("");
  const [currentCoordinate, setCurrentCoordinate] = useState({
    latitude: 35.720228,
    longitude: 51.39396,
    location_name: "",
    radius: "",
  });
  const goldIcon = L.icon({
    iconUrl: Icon,
    shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
    iconSize: [27, 44],
    shadowSize: [50, 50],
    shadowAnchor: [15, 50],
    iconAnchor: [13, 41], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -35], // point from which the popup should open relative to the iconAnchor
  });
  const SettingMap = () => {
    const map = useMap();
    map.on("click", (e) => {
      setCurrentCoordinate({
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
        location_name: "",
        radius: "",
      });
    });
    map.flyTo({
      lat: currentCoordinate.latitude,
      lng: currentCoordinate.longitude,
    });

    return (
      <>
        <Marker
          position={{
            lat: currentCoordinate.latitude,
            lng: currentCoordinate.longitude,
          }}
          icon={goldIcon}
          autoPanOnFocus
        >
          <Popup>{currentCoordinate.location_name}</Popup>
        </Marker>
        <Circle
          center={{
            lat: currentCoordinate.latitude,
            lng: currentCoordinate.longitude,
          }}
          radius={currentCoordinate.radius ? currentCoordinate.radius : 0}
          pathOptions={{ color: "#f6921e", fillColor: "#f6921e" }}
        />
      </>
    );
  };

  const LocationList = () =>
    locations.length > 0 &&
    locations.map((location, index) => (
      <div
        key={index}
        style={{
          ...styles.containerLocationList,
          backgroundColor:
            location.location_name == currentCoordinate.location_name &&
            "#f6921e30",
        }}
      >
        <span onClick={() => setCurrentCoordinate(location)}>
          <Room size={20} color="secondary" />
          <span style={{ color: "#000", fontSize: 15 }}>
            {location.location_name}
          </span>
        </span>
        <Delete
          size={20}
          color={!stateManager.isLoading ? "secondary" : "secondary80"}
          onClick={() => {
            setDeleteLocation(location.location_name);
            setOpenAlert(true);
          }}
        />
      </div>
    ));

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentCoordinate({
          ...currentCoordinate,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (err) => openSnackbar(err)
    );
    isPress && stateManager.isError && openSnackbar(stateManager.error);
    setLocations(stateManager.locations);
  }, [stateManager.locations, stateManager.isError, navigator.geolocation]);

  return (
    <>
      <AppBar label="Location" />
      <MapContainer
        center={{
          lat: currentCoordinate.latitude,
          lng: currentCoordinate.longitude,
        }}
        zoom={13}
        scrollWheelZoom={false}
        style={styles.map}
      >
        <SettingMap />
        <LocateControl />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.length > 0 &&
          locations.map((coordinate, index) => (
            <Marker
              position={{
                lat: coordinate.latitude,
                lng: coordinate.longitude,
              }}
              key={index}
            >
              <Popup>{coordinate.location_name}</Popup>
            </Marker>
          ))}
      </MapContainer>
      <Button label="Add New Location" onClick={() => setModalVisible(true)} />
      <Modal modalVisible={modalVisible} setModalVisible={setModalVisible}>
        <h2 style={styles.textAddLocation}>Add New Location</h2>
        {/*********************** two text input ***********************/}
        <div style={styles.containerTextInputBar}>
          <div style={styles.containerTextInput}>
            <Input
              customStyle={{ width: "100%" }}
              label="name"
              placeholder="name"
              value={currentCoordinate.location_name}
              Icon={() => <Room size={30} color="secondary80" />}
              setValue={(text) =>
                setCurrentCoordinate({
                  ...currentCoordinate,
                  location_name: text,
                })
              }
            />
          </div>
          <div style={styles.containerTextInput}>
            <Input
              customStyle={{ width: "100%" }}
              label="radius"
              placeholder="radius"
              type="number"
              value={currentCoordinate.radius.toString()}
              Icon={() => (
                <RadioButtonUnchecked size={30} color="secondary80" />
              )}
              IconEnd={() => <span style={{ color: "#000" }}>Meter</span>}
              setValue={(text) => {
                setCurrentCoordinate({
                  ...currentCoordinate,
                  radius: text
                    ? isNaN(parseInt(text))
                      ? 0
                      : parseInt(text)
                    : 0,
                });
              }}
            />
          </div>
        </div>
        {/*********************** two button ***********************/}
        <div style={styles.containerButton}>
          <Button
            label="Cancel"
            customStyle={{ width: "40%" }}
            type="SECONDARY"
            onClick={() => setModalVisible(false)}
          />
          <Button
            label="OK"
            customStyle={{ width: "40%" }}
            isLoading={stateManager.isLoading}
            onClick={() => {
              setIsPress(true);
              dispatch(
                addLocation(
                  currentCoordinate.latitude,
                  currentCoordinate.longitude,
                  currentCoordinate.location_name,
                  currentCoordinate.radius,
                  setModalVisible,
                  setIsPress
                )
              );
            }}
          />
        </div>
      </Modal>
      <Alert
        title="Delete Location"
        description="Are you sure you want to delete this location?"
        open={openAlert}
        setOpen={setOpenAlert}
        ButtonAction={[
          {
            text: "No",
          },
          {
            text: "Yes",
            onClick: () => {
              setIsPress(true);
              dispatch(DeleteLocation(deleteLocation, setIsPress));
            },
          },
        ]}
      />
      <LocationList />
    </>
  );
};
export default Location;
const styles = {
  map: {
    width: "100%",
    height: window.innerHeight / 1.75,
  },
  containerTextInputBar: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignSelf: "stretch",
    marginVertical: 10,
    display: "flex",
  },
  containerTextInput: {
    flexDirection: "row",
    alignItems: "baseline",
    display: "flex",
    width: "100%",
  },
  containerButton: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignSelf: "stretch",
    display: "flex",
  },
  containerLocationList: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    justifyContent: "space-between",
    margin: 10,
    padding: 10,
    display: "flex",
    borderRadius: 5,
  },
  textAddLocation: {
    color: "#000",
    fontSize: 20,
    marginTop: 5,
    marginBottom: 5,
    fontWeight: "bold",
    paddingBottom: 10,
    textAlign: "center",
  },
};
