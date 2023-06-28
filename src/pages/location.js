import React, { useState, useEffect } from "react";
import AppBar from "../components/appBar";
import Button from "../components/button";
import Modal from "../components//modal";
import { Room, Delete, RadioButtonUnchecked } from "@mui/icons-material";
import { useSnackbar } from "react-simple-snackbar";
import { useDispatch, useSelector } from "react-redux";
import Alert from "../components/alert";
import Input from "../components/input";
import Icon from "../assets/images/marker-icon-2x-gold.png";
import L from "leaflet";
import LocateControl from "../utils/locatecontrol";
import { Translate } from "../features/i18n/translate";
import LocationRemoveIcon from "../assets/images/locationRemoveIcon.svg";
import "./location.css";
import {
  addLocation,
  deleteLocation,
  fetchLocations,
} from "../features/locations/action";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";

const Location = () => {
  const { language, I18nManager } = useSelector((state) => state.i18n);
  const { locations, isLoading } = useSelector((state) => state.locations);
  const { phoneNumber } = useSelector((state) => state.auth.userInfo);
  const dispatch = useDispatch();
  const [openSnackbar] = useSnackbar();
  const [modalVisible, setModalVisible] = useState(false);
  const [isOpenAlert, setIsOpenAlert] = useState(false);
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

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);
  const openAlert = () => setIsOpenAlert(true);

  const iconEnd = () => (
    <span className="location-icon">{Translate("meter", language)}</span>
  );

  const onChangeNameLocation = (text) =>
    setCurrentCoordinate((coordinate) => ({
      ...coordinate,
      location_name: text,
    }));

  const onChangeRadius = (text) => {
    setCurrentCoordinate((coordinate) => ({
      ...coordinate,
      radius: text ? (isNaN(parseInt(text)) ? 0 : parseInt(text)) : 0,
    }));
  };

  const handleAddLocation = () => {
    dispatch(addLocation({ ...currentCoordinate, phoneNumber }))
      .unwrap()
      .then(closeModal)
      .catch((error) => {
        openSnackbar(
          error.code === "ERR_NETWORK"
            ? Translate("connectionFailed", language)
            : error.code === "ERR_BAD_REQUEST"
            ? Translate("locationNameExist", language)
            : error.message
        );
      });
  };

  const handleDeleteLocation = () =>
    dispatch(deleteLocation(currentCoordinate.location_name)).catch((error) => {
      openSnackbar(
        error.code === "ERR_NETWORK"
          ? Translate("connectionFailed", language)
          : error.message
      );
    });

  const LocationList = () =>
    locations.length > 0 && (
      <>
        <div className="location-title-list">
          {Translate("registeredLocations", language)}
        </div>
        {locations.map((location, index) => {
          const active =
            location.location_name === currentCoordinate.location_name;
          return (
            <div
              key={index}
              className={`location-bar ${
                active ? "location-bar-selected" : ""
              } ${I18nManager.isRTL ? "rtl" : "ltr"}`}
              onClick={() => setCurrentCoordinate(location)}
            >
              <span className={`location-bar-name${active ? "-selected" : ""}`}>
                <Room color={active ? "white" : "secondary"} />
                <span className="location-text">{location.location_name}</span>
              </span>
              <Delete
                color={active ? "white" : "secondary"}
                onClick={openAlert}
              />
            </div>
          );
        })}
      </>
    );

  useEffect(() => {
    dispatch(fetchLocations()).catch((error) => {
      openSnackbar(
        error.code === "ERR_NETWORK"
          ? Translate("connectionFailed", language)
          : error.message
      );
    });
  }, []);

  return (
    <>
      <AppBar label="location" />
      <MapContainer
        center={{
          lat: currentCoordinate.latitude,
          lng: currentCoordinate.longitude,
        }}
        zoom={13}
        scrollWheelZoom={false}
        className="location-map"
        style={{ height: window.innerHeight / 1.75 }}
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
      <Button
        label={Translate("addNewLocation", language)}
        onClick={openModal}
      />
      <Modal modalVisible={modalVisible} setModalVisible={setModalVisible}>
        <h2 className="location-title-modal">
          {Translate("addNewLocation", language)}
        </h2>
        <Input
          customStyle={{ width: "100%" }}
          label={Translate("nameLocation", language)}
          placeholder={Translate("nameLocation", language)}
          value={currentCoordinate.location_name}
          setValue={onChangeNameLocation}
          Icon={() => <Room size={30} color="secondary80" />}
        />
        <Input
          customStyle={{ width: "100%" }}
          label={Translate("radius", language)}
          placeholder={Translate("radius", language)}
          value={currentCoordinate.radius.toString()}
          setValue={onChangeRadius}
          type="number"
          Icon={() => <RadioButtonUnchecked size={30} color="secondary80" />}
          IconEnd={iconEnd}
        />
        <div
          className={`container_btn_row ${I18nManager.isRTL ? "rtl" : "ltr"}`}
        >
          <Button
            label={Translate("ok", language)}
            customStyle={{ width: "40%" }}
            isLoading={isLoading}
            onClick={handleAddLocation}
          />
          <Button
            label={Translate("cancel", language)}
            customStyle={{ width: "40%" }}
            type="SECONDARY"
            onClick={closeModal}
          />
        </div>
      </Modal>
      <LocationList />
      <Alert
        title={Translate("deleteLocation", language)}
        description={Translate("deleteLocationDescription", language)}
        open={isOpenAlert}
        setOpen={setIsOpenAlert}
        Icon={() => <img src={LocationRemoveIcon} alt="Location Remove" />}
        ButtonAction={[
          {
            text: Translate("yes", language),
            onClick: handleDeleteLocation,
          },
          {
            text: Translate("no", language),
            type: "SECONDARY",
          },
        ]}
      />
    </>
  );
};
export default Location;
