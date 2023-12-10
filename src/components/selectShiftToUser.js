import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Translate } from "../features/i18n/translate";
import { useSnackbar } from "react-simple-snackbar";
import { fetchShiftWork } from "../features/shiftWork/action";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Collapse, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { toggleShiftToUsers } from "../features/users/action";

const SelectShiftToUser = ({ userCurrent }) => {
  const [isCollapseShift, setIsCollapseShift] = useState(false);

  const { language } = useSelector((state) => state.i18n);
  const { shift } = useSelector((state) => state.shift);
  const { isLoading } = useSelector((state) => state.users);

  const [openSnackbar] = useSnackbar();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchShiftWork()).unwrap().catch(_error);
  }, []);

  const _error = (error) => {
    openSnackbar(
      error.code === "ERR_NETWORK"
        ? Translate("connectionFailed", language)
        : error.message
    );
  };

  const onChange = (id) => {
    dispatch(toggleShiftToUsers({ user_id: userCurrent.id, shift_id: id }));
  };

  const toggleCollapse = () => setIsCollapseShift((isCollapse) => !isCollapse);

  return (
    <div className="section-container">
      <div className="main-title text-align">
        {Translate("shiftWork", language)}
      </div>

      <div className="collapse direction" onClick={toggleCollapse}>
        <span>{Translate("addShiftToUser", language)}</span>
        <span style={{ color: "#f6921e" }}>
          {isCollapseShift ? (
            <ExpandLess fontSize="large" />
          ) : (
            <ExpandMore fontSize="large" />
          )}
        </span>
      </div>

      <Collapse in={isCollapseShift}>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          name="radio-buttons-group"
          defaultValue={userCurrent.shift}
          className="text-align direction"
          style={{ marginLeft: 16 }}
        >
          <FormControlLabel
            label={Translate("noShift", language)}
            value={null}
            disabled={isLoading}
            control={<Radio />}
            onChange={() => onChange(null)}
            checked={userCurrent.shift === null}
          />
          {shift.length > 0 ? (
            shift.map((s, i) => (
              <FormControlLabel
                key={i}
                label={s.name}
                value={s.id}
                disabled={isLoading}
                control={<Radio />}
                onChange={() => onChange(s.id)}
              />
            ))
          ) : (
            <div className="noItemText direction">
              {Translate("noWorkShift", language)}
            </div>
          )}
        </RadioGroup>
      </Collapse>
    </div>
  );
};

export default SelectShiftToUser;
