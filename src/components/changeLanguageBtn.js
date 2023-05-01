import React, { useState, useEffect } from "react";
import { animated, useSpring } from "@react-spring/web";
import IR from "../assets/images/iran.png";
import UK from "../assets/images/united-kingdom.png";
import { useDispatch, useSelector } from "react-redux";
import { changeLanguage } from "../redux/action/configAction";
import "./changeLanguageBtn.css";

const ChangeLanguageBtn = () => {
  const { language } = useSelector((state) => state.configReducer);
  const [selectLang, setSelectLang] = useState(language);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(changeLanguage(selectLang));
  }, [dispatch, selectLang]);

  const selectEn = () => {
    api.start({
      from: { x: 65 },
      to: { x: 0 },
    });

    setSelectLang("EN");
  };

  const selectPr = () => {
    api.start({
      from: { x: 0 },
      to: { x: 65 },
    });

    setSelectLang("FA");
  };

  const [translateX, api] = useSpring(() => ({
    from: { x: 0 },
  }));

  return (
    <div className="container_change_lang_btn">
      <animated.div className="select_lang" style={translateX} />
      <div onClick={selectEn} className="language_section">
        <img src={UK} className="image_country" alt="UK" />
        <p className="text_change_lang_btn">En</p>
      </div>
      <div onClick={selectPr} className="language_section">
        <p className="text_change_lang_btn">Pr</p>
        <img src={IR} className="image_country" alt="IR" />
      </div>
    </div>
  );
};

export default ChangeLanguageBtn;
