import React, { useCallback, useEffect, useMemo } from "react";
import AppBar from "../components/appBar";
import SettingBar from "../components/settingBar";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "react-simple-snackbar";
import { Translate } from "../features/i18n/translate";
import { fetchShiftWork } from "../features/shiftWork/action";
import { toggleShiftToUsers } from "../features/users/action";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import "./profileSetting.css";
import {
  KeyboardArrowDownOutlined,
  AccessTimeFilledRounded,
} from "@mui/icons-material";

const ShiftUser = () => {
  const { currentId } = useParams();

  const { language } = useSelector((state) => state.i18n);
  const { shift } = useSelector((state) => state.shift);
  const { users, isLoading } = useSelector((state) => state.users);

  const dispatch = useDispatch();

  const [openSnackbar] = useSnackbar();

  const userCurrent = useMemo(
    () => users.filter((user) => user.id == currentId)[0],
    [users, currentId]
  );

  useEffect(() => {
    dispatch(fetchShiftWork()).unwrap().catch(_error);
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

  const onChangeShift = useCallback(
    (id) => {
      dispatch(toggleShiftToUsers({ user_id: userCurrent.id, shift_id: id }));
    },
    [userCurrent]
  );

  return (
    <div className="status-member ">
      <AppBar label="shiftWork" type="back" />

      <div className="section-container">
        <SettingBar
          title="shiftWork"
          info="addShiftToUser"
          Icon={AccessTimeFilledRounded}
          EndAdornment={() => <KeyboardArrowDownOutlined fontSize="large" />}
          Collapse={() => (
            <div className="profile-setting-collapse">
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
                defaultValue={userCurrent.shift}
                className="text-align direction"
                sx={{ pl: 1.4, pr: 1.4 }}
              >
                <FormControlLabel
                  label={Translate("noShift", language)}
                  value={null}
                  disabled={isLoading}
                  control={<Radio />}
                  onChange={() => onChangeShift(null)}
                  sx={{ width: "100%" }}
                  checked={userCurrent.shift === null}
                />
                {shift.length > 0 &&
                  shift.map((s, i) => (
                    <FormControlLabel
                      key={i}
                      sx={{ width: "100%" }}
                      label={s.name}
                      value={s.id}
                      disabled={isLoading}
                      control={<Radio />}
                      onChange={() => onChangeShift(s.id)}
                    />
                  ))}
              </RadioGroup>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default ShiftUser;
