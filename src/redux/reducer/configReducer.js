import { CHANGE_LANGUAGE } from "../action/actionType";

const localStorageLang = localStorage.getItem("language");
const initialState = {
  language: localStorageLang ? localStorageLang : "EN",
  I18nManager: { isRTL: false },
};

const configReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_LANGUAGE: {
      return {
        ...state,
        language: action.payload,
        I18nManager: { isRTL: action.payload === "FA" },
      };
    }
    default: {
      return state;
    }
  }
};
export default configReducer;
