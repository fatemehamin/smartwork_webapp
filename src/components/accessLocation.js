import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CheckBox from "./checkBox";
import { Translate } from "../features/i18n/translate";
import {
  addLocationToUsers,
  deleteLocationToUsers,
  fetchUsersLocation,
} from "../features/users/action";
import { fetchLocations } from "../features/locations/action";
import { useSnackbar } from "react-simple-snackbar";

const AccessLocation = ({ userCurrent, CustomCollapse }) => {
  const { language, I18nManager } = useSelector((state) => state.i18n);
  const { locations } = useSelector((state) => state.locations);
  const { isLoading } = useSelector((state) => state.users);
  const [openSnackbar] = useSnackbar();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchLocations())
      .unwrap()
      .catch((error) => {
        openSnackbar(
          error.code === "ERR_NETWORK"
            ? Translate("connectionFailed", language)
            : error.message
        );
      });
    dispatch(fetchUsersLocation(userCurrent.phone_number))
      .unwrap()
      .catch((error) => {
        openSnackbar(
          error.code === "ERR_NETWORK"
            ? Translate("connectionFailed", language)
            : error.message
        );
      });
  }, []);

  const onChangeCheck = (e, selectedLocation) => {
    const arg = { phone_number: userCurrent.phone_number, selectedLocation };

    dispatch(
      e.target.checked ? addLocationToUsers(arg) : deleteLocationToUsers(arg)
    )
      .unwrap()
      .catch((error) => {
        openSnackbar(
          error.code === "ERR_NETWORK"
            ? Translate("connectionFailed", language)
            : error.message
        );
      });
  };

  const contentCollapse = () =>
    locations.map((l, i) => (
      <CheckBox
        key={i}
        name={l.location_name}
        disabled={isLoading}
        onChange={(e) => onChangeCheck(e, l)}
        toggle={
          userCurrent.location !== undefined &&
          userCurrent.location.find(
            (loc) => loc.location_name === l.location_name
          ) !== undefined
        }
      />
    ));

  const className = {
    title: `main-title text-${I18nManager.isRTL ? "right" : "left"}`,
  };

  return (
    <div className="section-container">
      <div className={className.title}>{Translate("location", language)}</div>
      <CustomCollapse
        label={Translate("addLocationToUser", language)}
        content={contentCollapse}
      />
    </div>
  );
};

export default AccessLocation;
