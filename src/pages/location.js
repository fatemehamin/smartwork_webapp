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
// import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
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

  // const SearchField = () => {
  //   const map = useMap();

  //   // ایجاد یک متغیر ref برای ذخیره searchControl
  //   const searchControlRef = useRef(null);

  //   // ...

  //   useEffect(() => {
  //     const provider = new OpenStreetMapProvider();
  //     // ایجاد یک instance از GeoSearchControl با استفاده از متغیر ref
  //     searchControlRef.current = new GeoSearchControl({
  //       provider,
  //       style: "bar",
  //       autoComplete: true,
  //       showMarker: true,
  //       showPopup: false,
  //       autoClose: true,
  //       searchLabel: Translate("search", language),
  //     });

  //     map.addControl(searchControlRef.current);

  //     // افزودن listener به نتایج جستجو
  //     searchControlRef.current._provider.on("results", (data) => {
  //       if (data?.length > 0) {
  //         const firstResult = data[0];
  //         const { x, y } = firstResult?.location || {};

  //         if (x && y) {
  //           const latLng = L.latLng(y, x);

  //           if (map) {
  //             map.setView(latLng, map.getZoom());
  //           }
  //         }
  //       }
  //     });

  //     // حذف Control در هنگام unmount کامپوننت
  //     return () => {
  //       if (searchControlRef.current) {
  //         map.removeControl(searchControlRef.current);
  //         searchControlRef.current._provider.off("results");
  //       }
  //     };
  //   }, [map, language]);

  //   // const form = document.querySelector("form");
  //   // const input = form.querySelector('input[type="text"]');

  //   // form.addEventListener("submit", async (event) => {
  //   //   event.preventDefault();

  //   //   const results = await provider.search({ query: input.value });
  //   //   console.log(results); // » [{}, {}, {}, ...]
  //   // });

  //   // const searchControl = new GeoSearchControl({
  //   //   provider,
  //   //   showMarker: true, // optional: true|false  - default true
  //   //   showPopup: false, // optional: true|false  - default false
  //   //   marker: {
  //   //     // optional: L.Marker    - default L.Icon.Default
  //   //     icon: new L.Icon.Default(),
  //   //     draggable: false,
  //   //   },
  //   //   popupFormat: ({ query, result }) => result.label, // optional: function    - default returns result label,
  //   //   resultFormat: ({ result }) => result.label, // optional: function    - default returns result label
  //   //   maxMarkers: 1, // optional: number      - default 1
  //   //   retainZoomLevel: false, // optional: true|false  - default false
  //   //   animateZoom: true, // optional: true|false  - default true
  //   //   autoClose: false, // optional: true|false  - default false
  //   //   searchLabel: "Enter address", // optional: string      - default 'Enter address'
  //   //   keepResult: false, // optional: true|false  - default false
  //   //   updateMap: true, // optional: true|false  - default true
  //   // });

  //   // const [inputValue, setInputValue] = useState("");
  //   // const provider = new MapBoxProvider({
  //   // params: {
  //   //   access_token: apiKey,
  //   // },
  //   // });
  //   // const t = async () => {
  //   //   const results = await provider.search({ query: inputValue });
  //   //   console.log(results);
  //   // };
  //   // console.log(
  //   //   "fff",
  //   //   (document.getElementsByClassName("glass").value = "میدان ولیعصر")
  //   // );
  //   // const results =  provider.search({ query: input.value });
  //   // const searchControl = new GeoSearchControl({
  //   // provider,
  //   // style: "bar",
  //   // autoComplete: true,
  //   // showMarker: true,
  //   // showPopup: false,
  //   // autoClose: true,
  //   // searchLabel: Translate("search", language),
  //   //   style: "bar",
  //   //   position: "topright",
  //   //   showMarker: false,
  //   //   showPopup: false,
  //   //   autoClose: false,
  //   //   retainZoomLevel: false,
  //   //   animateZoom: true,
  //   //   keepResult: false,
  //   //   searchLabel: "Enter Address",
  //   // });

  //   // var marker = L.marker([51.5, -0.09]).addTo(map);

  //   // افزودن سرچ باکس با استفاده از Leaflet-Search
  //   // const searchControl = new L.Control.Search({
  //   //   layer: marker, // افزودن لایه برای جستجو
  //   //   propertyName: "name", // فیلد جستجو
  //   //   marker: false, // غیرفعال کردن نمایش مارکرها
  //   // });
  //   // var searchControl = new L.Control.Search({
  //   //   position: "topright",
  //   //   // layer: L.geoJSON(yourData), // لایه GeoJSON که جستجو در آن انجام می‌شود
  //   //   propertyName: "name", // نام ویژگی جستجویی
  //   //   marker: false, // نمایش مارکر برای نتایج یا خیر
  //   // });

  //   // searchControl.on("search:locationfound", function (e) {
  //   //   // عملیاتی که باید برای یک موقعیت یافت شده انجام شود
  //   //   // مثلاً مرکز نقشه را به موقعیت یافته تنظیم کنید
  //   //   map.setView(e.latlng, map.getZoom());
  //   // });

  //   // useEffect(() => {
  //   //   map.addControl(searchControl);
  //   //   return () => map.removeControl(searchControl);
  //   // }, []);

  //   // useEffect(() => {
  //   // searchControl._provider.on("results", (data) => {
  //   //   if (data?.length > 0) {
  //   //     const firstResult = data[0]; // در اینجا اولین نتیجه را در نظر می‌گیریم
  //   //     const { x, y } = firstResult?.location || {};
  //   //     if (x && y) {
  //   //       // x به معنای longitude و y به معنای latitude است
  //   //       console.log("Latitude:", y);
  //   //       console.log("Longitude:", x);
  //   //       // می‌توانید این مختصات را برای هر کاری که نیاز دارید، مانند نشان دادن مارکر در نقشه، استفاده کنید.
  //   //     }
  //   //   }
  //   // });

  //   // console.log("ffff", t());

  //   // map.addControl(searchControl);

  //   // return () => map.removeControl(searchControl);
  //   // }, [modalVisible, map, language]);

  //   return null;
  // };

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

  // const mapOptions = {
  //   searchControl: {
  //     provider: "OpenStreetMap", // یا هر سرویس نقشه‌ای که استفاده می‌کنید
  //   },
  // };

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
        {/* <SearchField /> */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* <SearchControl options={mapOptions.searchControl} /> */}
        {/* <SearchField apiKey={"AIzaSyDQmrTGz3Vf2pPHPs0cDCScBAasVhmp6zw"} /> */}
        {/* <SearchControl
          position="topleft"
          provider="OpenStreetMap"
          showMarker={true}
          showPopup={false}
          retainZoomLevel={false}
          animateZoom={true}
          autoClose={false}
          searchLabel="Enter address"
        /> */}
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
