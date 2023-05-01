import en from "./en.json";
import fa from "./fa.json";
// import { useSelector } from "react-redux";

export const Translate = (key, language) => {
  // const { language } = useSelector((state) => state.configReducer);
  const langData = language === "EN" ? en : fa;
  return langData[key];
};
