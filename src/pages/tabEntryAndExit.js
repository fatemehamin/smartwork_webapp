import React, { useEffect, useState } from "react";
import Alert from "../components/alert";
import checkLocation from "../utils/checkLocation";
import LocateControl from "../utils/locatecontrol";
import { ReactComponent as LocationErrorIcon } from "../assets/icons/location_error.svg";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "react-simple-snackbar";
import { useSwipeable } from "react-swipeable";
import { animated, useSpring } from "@react-spring/web";
import { MapContainer, TileLayer } from "react-leaflet";
import { Login, Logout } from "@mui/icons-material";
import { Translate } from "../features/i18n/translate";
import { endTime, entry, exit } from "../features/tasks/action";
import { fetchLocationSpacialUser } from "../features/locations/action";
import { setIsAutoExit, setIsLoading } from "../features/tasks/tasksSlice";
import { setMyTaskActiveTab } from "../features/config/configSlice";
import "./tabEntryAndExit.css";

const TabEntryAndExit = () => {
  const [isEntry, setIsEntry] = useState(false);
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [locationDenied, setLocationDenied] = useState("");

  const [width, api] = useSpring(() => ({ from: { width: "44px" } }));

  const locations = useSelector((state) => state.locations.locationSpacialUser);
  const { language } = useSelector((state) => state.i18n);
  const { userInfo } = useSelector((state) => state.auth);
  const { currentTask, lastEntry, isLoading, permissionAutoExit, isAutoExit } =
    useSelector((state) => state.tasks);

  const [openSnackbar] = useSnackbar();
  const dispatch = useDispatch();

  useEffect(() => {
    setIsEntry(lastEntry ? true : false);
    userInfo?.phoneNumber &&
      dispatch(fetchLocationSpacialUser(userInfo.phoneNumber))
        .unwrap()
        .catch(_error);
  }, [lastEntry, userInfo?.phoneNumber]);

  useEffect(() => {
    permissionAutoExit &&
      locations.length > 0 &&
      isEntry &&
      navigator.geolocation.watchPosition(watchPosition, onError);
  }, [isAutoExit, permissionAutoExit, isEntry, locations]);

  const FullWidth = () =>
    api.start({ from: { width: "44px" }, to: { width: "200px" } });

  const emptyWidth = () =>
    api.start({ from: { width: "200px" }, to: { width: "44px" } });

  const watchPosition = (position) => {
    const matchingLocations = locations.filter((location) =>
      checkLocation(
        {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        location,
        location.radius
      )
    );
    if (matchingLocations.length === 0) {
      dispatch(setIsAutoExit(true));
      exitEntryHandler();
    } else {
      dispatch(setIsAutoExit(false));
    }
  };

  const _error = (error) => {
    openSnackbar(
      error.code === "ERR_NETWORK"
        ? Translate("connectionFailed", language)
        : error.message
    );
  };

  const alert = {
    locationNotCorrect: {
      title: "location",
      description: "errorLocationNotCorrect",
      Icon: LocationErrorIcon,
      ButtonAction: [{ text: "ok" }],
    },
    locationDenied: {
      title: "locationDenied",
      description: locationDenied,
      Icon: LocationErrorIcon,
      ButtonAction: [{ text: "ok" }],
    },
  };

  const onSuccess = (position) => {
    const matchingLocations = locations.filter((location) =>
      checkLocation(
        {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        location,
        location.radius
      )
    );
    if (matchingLocations.length > 0) {
      exitEntryHandler();
    } else {
      emptyWidth();
      setIsOpenAlert(true);
      setAlertType("locationNotCorrect");
      dispatch(setIsLoading(false));
    }
  };

  const onError = (error) => {
    emptyWidth();
    setLocationDenied(error.message);
    setAlertType("locationDenied");
    setIsOpenAlert(true);
    dispatch(setIsLoading(false));
  };

  const exitEntryHandler = () => {
    const _exit = () => {
      const args = { phoneNumber: userInfo.phoneNumber, isExitWithBoss: false };
      dispatch(exit(args))
        .unwrap()
        .then(() => {
          setIsEntry(false);
          emptyWidth();
        })
        .catch((error) => {
          emptyWidth();
          _error(error);
        });
    };

    const argsEndTime = {
      name: currentTask.name,
      phoneNumber: userInfo.phoneNumber,
    };

    const _thenEntry = () => {
      setIsEntry(true);
      emptyWidth();
      dispatch(setMyTaskActiveTab("tasks"));
    };

    const _errorEntry = (error) => {
      emptyWidth();
      _error(error);
    };

    isEntry
      ? currentTask.start // if have enable task first all task disable then exit
        ? dispatch(endTime(argsEndTime)).unwrap().then(_exit).catch(_error)
        : _exit()
      : dispatch(entry()).unwrap().then(_thenEntry).catch(_errorEntry);
  };

  const handlers = useSwipeable({
    onSwiped: (eventData) => {
      FullWidth();
      setTimeout(() => {
        if (!isLoading) {
          dispatch(setIsLoading(true));
          locations.length > 0
            ? navigator.geolocation.getCurrentPosition(onSuccess, onError)
            : exitEntryHandler();
        }
      }, 900);
    },
    trackMouse: true,
  });

  const ExitEntryBtn = () => (
    <div className="exit-entry-row" style={styles.exitEntry}>
      <div className="exit-entry-outline">
        <div className="exit-entry-inline">
          <animated.div
            className={className.exitEntry}
            style={width}
            {...handlers}
          >
            {isEntry ? (
              <Logout color="white" fontSize="small" />
            ) : (
              <Login color="white" fontSize="small" />
            )}
          </animated.div>
          <p className={className.exitEntryText}>
            {Translate(isEntry ? "exit" : "entry", language)}
          </p>
        </div>
      </div>
    </div>
  );

  const styles = {
    map: {
      height:
        window.innerHeight > window.innerWidth
          ? (window.innerHeight * 2) / 3
          : window.innerHeight / 2,
    },
    exitEntry: {
      height:
        window.innerHeight > window.innerWidth
          ? window.innerHeight / 3 - 106
          : window.innerHeight / 2 - 116,
    },
  };

  const className = {
    exitEntry: `exit-entry ${isLoading ? "exit-entry-disable" : ""} ${
      isEntry ? "exit" : "entry"
    }${isLoading ? "-disable" : ""}`,
    exitEntryText: `exit-entry-text ${isEntry ? "exit-text" : "entry-text"}${
      isLoading ? "-disable" : ""
    }`,
  };

  return (
    <>
      <MapContainer
        center={{ lat: 35.720228, lng: 51.39396 }}
        zoom={13}
        scrollWheelZoom={false}
        className="map"
        style={styles.map}
      >
        <LocateControl />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
      <ExitEntryBtn />
      <Alert
        {...alert[alertType]}
        open={isOpenAlert}
        setOpen={setIsOpenAlert}
      />
    </>
  );
};

export default TabEntryAndExit;
