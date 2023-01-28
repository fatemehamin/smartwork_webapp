import React, { useState, useEffect } from "react";
import AppBar from "../components/AppBar";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { useMap } from "react-leaflet/hooks";
import Button from "../components/Button";
import Modal from "../components//modal";
import { Room, Delete, RadioButtonUnchecked } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { addLocation, DeleteLocation } from "../redux/action/managerAction";
import Alert from "../components/Alert";
import Input from "../components/Input";
// import pin from "../../src/assets/images/marker-icon-2x-gold.png";
// import L from "leaflet";
export default () => {
  const stateManager = useSelector((state) => state.managerReducer);
  const dispatch = useDispatch();
  const [locations, setLocations] = useState([]);
  const [isError, setIsError] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [currentCoordinate, setCurrentCoordinate] = useState({
    latitude: 35.720228,
    longitude: 51.39396,
    location_name: "",
    radius: "",
  });

  // const iconPerson = new L.Icon({
  //   iconUrl: require("../../src/assets/images/marker-icon-2x-gold.png"),
  //   iconRetinaUrl: require("../../src/assets/images/marker-icon-2x-gold.png"),
  //   iconAnchor: null,
  //   popupAnchor: null,
  //   shadowUrl: null,
  //   shadowSize: null,
  //   shadowAnchor: null,
  //   // iconSize: new L.Point(60, 75),
  //   // className: "leaflet-div-icon",
  // });
  const LocationList = () =>
    locations.length > 0 &&
    locations.map((location, index) => (
      <div key={index} style={styles.containerLocationList}>
        <span
          style={styles.nameLocation}
          onClick={() => setCurrentCoordinate(location)}
        >
          <Room size={20} color="secondary" />
          <span style={{ color: "#000", fontSize: 15 }}>
            {location.location_name}
          </span>
        </span>
        <Delete
          size={20}
          color="secondary"
          onClick={() => setOpenAlert(true)}
        />
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
              onClick: () => dispatch(DeleteLocation(location.location_name)),
              autoFocus: true,
            },
          ]}
        />
      </div>
    ));
  useEffect(() => {
    setLocations(stateManager.locations);
    !isError && setLocations([...locations, currentCoordinate]);
    setIsError(true);
  }, [stateManager.locations, isError]);

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
        // showsUserLocation={true}
        // showsMyLocationButton={true}
        // focusable={true}
        // onPress={e => {
        //   setCurrentCoordinate({
        //     ...currentCoordinate,
        //     ...e.nativeEvent.coordinate,
        //   });
        // }}
      >
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
              // pinColor="violet"
              // icon={pin}
            >
              <Popup>{coordinate.name}</Popup>
            </Marker>
          ))}
        <Marker
          position={{
            lat: currentCoordinate.latitude,
            lng: currentCoordinate.longitude,
          }}
          autoPanOnFocus
          // icon={iconPerson}
          // pinColor="gold"
        >
          <Popup>{currentCoordinate.name}</Popup>
        </Marker>

        <Circle
          center={{
            lat: currentCoordinate.latitude,
            lng: currentCoordinate.longitude,
          }}
          radius={currentCoordinate.radius ? currentCoordinate.radius : 0}
          // strokeColor="#f6921e"
          // fillColor="#f6921e20"
          pathOptions={{ color: "#f6921e", fillColor: "#f6921e" }}
        />
      </MapContainer>
      <Button label="Add New Location" onClick={() => setModalVisible(true)} />
      <Modal modalVisible={modalVisible} setModalVisible={setModalVisible}>
        <h2 style={styles.text}>Add New Location</h2>
        {/* two text input */}
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
        {/* two button */}
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
              dispatch(
                addLocation(
                  currentCoordinate.latitude,
                  currentCoordinate.longitude,
                  currentCoordinate.location_name,
                  currentCoordinate.radius,
                  setIsError,
                  setModalVisible
                )
              );
            }}
          />
        </div>
      </Modal>
      <LocationList />
    </>
  );
};

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
    alignItems: "baseline",
    alignSelf: "stretch",
    justifyContent: "space-between",
    marginLeft: 20,
    marginRight: 20,
    display: "flex",
  },
  nameLocation: {
    flexDirection: "row",
    alignItems: "baseline",
    paddingTop: 5,
    paddingBottom: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  text: {
    color: "#000",
    fontSize: 20,
    marginTop: 5,
    marginBottom: 5,
    fontWeight: "bold",
    paddingBottom: 10,
    textAlign: "center",
  },
};
