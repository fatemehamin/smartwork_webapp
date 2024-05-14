import React, { useCallback, useEffect, useMemo } from "react";
import AppBar from "../components/appBar";
import CheckBox from "../components/checkBox";
import SettingBar from "../components/settingBar";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "react-simple-snackbar";
import { Translate } from "../features/i18n/translate";
import { fetchLocations } from "../features/locations/action";
import { KeyboardArrowDownOutlined, PinDropRounded } from "@mui/icons-material";
import "./profileSetting.css";
import {
  addLocationToUsers,
  deleteLocationToUsers,
  fetchUsersLocation,
} from "../features/users/action";

const LocationUser = () => {
  const { currentId } = useParams();

  const { language } = useSelector((state) => state.i18n);
  const { locations } = useSelector((state) => state.locations);
  const { users, isLoading } = useSelector((state) => state.users);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [openSnackbar] = useSnackbar();

  const { phone_number, location: userLocation } = useMemo(
    () => users.filter((user) => user.id == currentId)[0],
    [users, currentId]
  );

  useEffect(() => {
    dispatch(fetchLocations()).unwrap().catch(_error);
    dispatch(fetchUsersLocation(phone_number)).unwrap().catch(_error);
    window.scrollTo(0, 0);
  }, []);

  const _error = useCallback(
    (error) => {
      openSnackbar(
        error.code === "ERR_NETWORK"
          ? Translate("connectionFailed", language)
          : error.message
      );
    },
    [language]
  );

  const onChangeCheck = useCallback(
    (e, selectedLocation) => {
      const arg = { phone_number, selectedLocation };

      dispatch(
        e.target.checked ? addLocationToUsers(arg) : deleteLocationToUsers(arg)
      )
        .unwrap()
        .catch(_error);
    },
    [phone_number]
  );

  const checkToggleLocation = useCallback(
    (nameLocation) =>
      !!userLocation &&
      !!userLocation.find((loc) => loc.location_name === nameLocation),
    [userLocation]
  );

  const navigateLocation = () => navigate("/location/1");

  return (
    <div className="status-member">
      <AppBar label="location" type="back" />

      <div className="section-container">
        <SettingBar
          title="location"
          info="addLocationToUser"
          Icon={PinDropRounded}
          EndAdornment={() => <KeyboardArrowDownOutlined fontSize="large" />}
          Collapse={() => (
            <div className="profile-setting-collapse">
              {locations.length > 0 ? (
                locations.map((l, i) => (
                  <CheckBox
                    key={i}
                    name={l.location_name}
                    disabled={isLoading}
                    onChange={(e) => onChangeCheck(e, l)}
                    defaultChecked={false}
                    toggle={checkToggleLocation(l.location_name)}
                  />
                ))
              ) : (
                <div className="noItemText direction">
                  {Translate("notExistLocation", language)}
                </div>
              )}
              <div onClick={navigateLocation} className="addLocation">
                <p className="addLocationText">
                  {Translate("addNewLocation", language)}
                </p>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default LocationUser;
