import React, { useState, useEffect, useRef } from "react";
import { Room, Delete, RadioButtonUnchecked } from "@mui/icons-material";
import { useSnackbar } from "react-simple-snackbar";
import { useDispatch, useSelector } from "react-redux";
import { Translate } from "../features/i18n/translate";
import { ReactComponent as LocationRemoveIcon } from "../assets/icons/location_remove.svg";
import { useParams } from "react-router-dom";
import AppBar from "../components/appBar";
import Button from "../components/button";
import Modal from "../components//modal";
import Alert from "../components/alert";
import Input from "../components/input";
import Icon from "../assets/images/marker-icon-2x-gold.png";
import L from "leaflet";
import LocateControl from "../utils/locatecontrol";
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
  const { isBack } = useParams();

  const [modalVisible, setModalVisible] = useState(false);
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [currentCoordinate, setCurrentCoordinate] = useState({
    latitude: 35.720228,
    longitude: 51.39396,
    location_name: "",
    radius: "",
  });

  const { language } = useSelector((state) => state.i18n);
  const { locations, isLoading } = useSelector((state) => state.locations);
  const phoneNumber = useSelector((state) => state.auth.userInfo?.phoneNumber);

  const [openSnackbar] = useSnackbar();
  const radiusRef = useRef(null);
  const dispatch = useDispatch();

  const disableBtn = !(
    currentCoordinate.location_name.trim() && currentCoordinate.radius
  );

  useEffect(() => {
    dispatch(fetchLocations()).catch(_error);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    modalVisible && window.scrollTo(0, 0);
  }, [modalVisible]);

  const _error = (error) => {
    openSnackbar(
      error.code === "ERR_NETWORK"
        ? Translate("connectionFailed", language)
        : error.message
    );
  };

  const goldIcon = L.icon({
    iconUrl: Icon,
    shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
    iconSize: [27, 44],
    shadowSize: [50, 50],
    shadowAnchor: [15, 50],
    iconAnchor: [13, 41], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -35], // point from which the popup should open relative to the iconAnchor
  });

  const center = {
    lat: currentCoordinate.latitude,
    lng: currentCoordinate.longitude,
  };

  const SettingMap = () => {
    const option = {
      coordinate: {
        lat: currentCoordinate.latitude,
        lng: currentCoordinate.longitude,
      },
      name: currentCoordinate.location_name,
    };

    const map = useMap();

    map.on("click", (e) => {
      setCurrentCoordinate({
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
        location_name: "",
        radius: "",
      });
    });

    map.flyTo(option.coordinate);

    return (
      <>
        <Marker position={option.coordinate} icon={goldIcon} autoPanOnFocus>
          {option.name && <Popup>{option.name}</Popup>}
        </Marker>
        <Circle
          center={option.coordinate}
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

  const onChangeName = (text) =>
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

  const onKeyDownLocationName = (e) => {
    if (e.keyCode === 13) {
      radiusRef.current.focus();
    }
  };

  const onKeyDownLocationRadius = (e) => {
    if (e.keyCode === 13 && !disableBtn) {
      handleAddLocation();
    }
  };

  const handleAddLocation = () => {
    const _error = (error) => {
      openSnackbar(
        error.code === "ERR_NETWORK"
          ? Translate("connectionFailed", language)
          : error.code === "ERR_BAD_REQUEST"
          ? Translate("locationNameExist", language)
          : error.message
      );
    };

    dispatch(addLocation({ ...currentCoordinate, phoneNumber }))
      .unwrap()
      .then(closeModal)
      .catch(_error);
  };

  const handleDeleteLocation = () => {
    dispatch(deleteLocation(currentCoordinate.location_name)).catch(_error);
  };

  const LocationList = () =>
    locations.length > 0 &&
    locations.map((location, index) => {
      const active = location.location_name === currentCoordinate.location_name;

      const handleDeleteLocation = () => {
        openAlert();
        setCurrentCoordinate(location);
      };

      return (
        <div
          key={index}
          className={`location-bar ${
            active ? "location-bar-selected" : ""
          } direction`}
          onClick={() => setCurrentCoordinate(location)}
        >
          <span className={`location-bar-name${active ? "-selected" : ""}`}>
            <Room color={active ? "white" : "secondary"} />
            <span className="location-text">{location.location_name}</span>
          </span>
          <Delete
            color={active ? "white" : "secondary"}
            onClick={handleDeleteLocation}
          />
        </div>
      );
    });

  const propsAlert = {
    title: "deleteLocation",
    description: "deleteLocationDescription",
    open: isOpenAlert,
    setOpen: setIsOpenAlert,
    Icon: LocationRemoveIcon,
    ButtonAction: [
      { text: "yes", onClick: handleDeleteLocation, isLoading },
      { text: "no", type: "SECONDARY" },
    ],
  };

  const propsModal = {
    modalVisible,
    setModalVisible,
    label: "addNewLocation",
    buttonActions: [
      {
        text: "ok",
        action: handleAddLocation,
        isLoading,
        disabled: disableBtn,
      },
      { text: "cancel", action: closeModal },
    ],
  };

  return (
    <>
      <AppBar label="location" type={parseInt(isBack) ? "Back" : "Menu"} />
      <MapContainer
        center={center}
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
      <div className="location-title-list">
        {locations.length > 0 && Translate("registeredLocations", language)}
      </div>
      <LocationList />
      <Modal {...propsModal}>
        <Input
          label={Translate("nameLocation", language)}
          placeholder={Translate("nameLocation", language)}
          value={currentCoordinate.location_name}
          setValue={onChangeName}
          Icon={() => <Room size={30} color="secondary80" />}
          onKeyDown={onKeyDownLocationName}
        />
        <Input
          label={Translate("radius", language)}
          placeholder={Translate("radius", language)}
          value={currentCoordinate.radius?.toString()}
          setValue={onChangeRadius}
          type="number"
          Icon={() => <RadioButtonUnchecked size={30} color="secondary80" />}
          IconEnd={iconEnd}
          ref={radiusRef}
          onKeyDown={onKeyDownLocationRadius}
        />
      </Modal>
      <Alert {...propsAlert} />
    </>
  );
};
export default Location;
