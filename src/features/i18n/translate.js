import en from "./en.json";
import fa from "./fa.json";

export const Translate = (key, language) => {
  const langData = language === "EN" ? en : fa;
  return langData[key];
};
