import React from "react";
import { TextField, styled } from "@mui/material";
import "./codeField.css";

export default ({ cellCount, code, setCode }) => {
  let inputs = new Array(cellCount).fill(0);
  return (
    <div className="codeField">
      {inputs.map((input, index) =>
        code.length == index ||
        (code.length - 1 == index && index == cellCount - 1) ? (
          <styles.Input
            key={index}
            type="tel"
            className="codeField_input"
            onChange={(event) => {
              /^(?=.*\d)[\d]*$/.test(event.target.value) &&
                setCode(code + event.target.value); // for give just number
            }}
            inputMode="numeric"
            autoFocus
            onKeyDown={(event) =>
              event.keyCode == 8 && setCode(code.slice(0, -1))
            }
            variant="standard"
            inputProps={{ maxLength: 1, style: styles.textInput }}
          />
        ) : (
          <div className="codeField_input" key={index} style={styles.text}>
            {code[index]}
          </div>
        )
      )}
    </div>
  );
};
const styles = {
  Input: styled(TextField)({
    margin: 10,
    "& .MuiInput-input": {
      marginBottom: 3,
      paddingBottom: 1,
      alignItems: "center",
      justifyContent: "center",
      borderBottomColor: "#eee",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#bd10e0",
    },
  }),
  textInput: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 30,
  },
  text: { alignItems: "center", justifyContent: "center" },
};
