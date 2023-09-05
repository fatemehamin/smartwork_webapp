import React from "react";
import { TextField, styled } from "@mui/material";
import "./codeField.css";

const CodeFiled = ({ cellCount, code, setCode }) => {
  let inputs = new Array(cellCount).fill(0);

  const onChangeHandler = (event) => {
    /^(?=.*\d)[\d]*$/.test(event.target.value) && // for give just number
      code.length < cellCount &&
      setCode(code + event.target.value);
  };

  const onKeyDownHandler = (event) => {
    event.key === "Backspace" && setCode(code.slice(0, -1));
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
  };

  return (
    <div className="codeField">
      {inputs.map((input, index) =>
        code.length === index ||
        (code.length - 1 === index && index === cellCount - 1) ? (
          <styles.Input
            key={index}
            type="tel"
            className="codeField_input"
            onChange={onChangeHandler}
            value={code[index]}
            inputMode="numeric"
            autoFocus
            onKeyDown={onKeyDownHandler}
            variant="standard"
            inputProps={{ maxLength: 1, style: styles.textInput }}
          />
        ) : (
          <div className="codeField_input" key={index}>
            {code[index]}
          </div>
        )
      )}
    </div>
  );
};

export default CodeFiled;
