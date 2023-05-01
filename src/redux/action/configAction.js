import { CHANGE_LANGUAGE } from "./actionType";

export const changeLanguage = (lang) => {
  localStorage.setItem("language", lang);
  return (dispatch) => {
    dispatch({ type: CHANGE_LANGUAGE, payload: lang });
  };
};
