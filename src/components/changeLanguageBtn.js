import React, { useState, useEffect } from "react";
import { animated, useSpring } from "@react-spring/web";
import { useDispatch, useSelector } from "react-redux";
import { changeLanguage } from "../features/i18n/i18nSlice";
import IR from "../assets/images/iran.png";
import UK from "../assets/images/united-kingdom.png";
import "./changeLanguageBtn.css";

const ChangeLanguageBtn = () => {
  const { language } = useSelector((state) => state.i18n);

  const [selectLang, setSelectLang] = useState(language);

  const dispatch = useDispatch();
  const translateX = useSpring({ x: selectLang === "EN" ? 0 : 70 });

  useEffect(() => {
    dispatch(changeLanguage(selectLang));
  }, [selectLang]);

  const selectEn = () => setSelectLang("EN");
  const selectPr = () => setSelectLang("FA");

  return (
    <div className="container_change_lang_btn">
      <animated.div className="select_lang" style={translateX} />
      <div onClick={selectEn} className="language_section">
        <img src={UK} className="image_country" alt="UK" />
        <p className="text_change_lang_btn">En</p>
      </div>
      <div onClick={selectPr} className="language_section">
        <p className="text_change_lang_btn">Fa</p>
        <img src={IR} className="image_country" alt="IR" />
      </div>
    </div>
  );
};

export default ChangeLanguageBtn;
