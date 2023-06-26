import React from "react";
import { useSelector } from "react-redux";
import { Translate } from "../features/i18n/translate";
import "./tabs.css";

const Tab = ({ titles, activeFilter, setActiveFilter }) => {
  const { language } = useSelector((state) => state.i18n);

  return (
    <div className="filterContainer">
      {titles.map((title) => (
        <div
          className={`filter ${activeFilter === title && "activeFilter"}`}
          style={{ width: `${100 / titles.length}%` }}
          onClick={() => setActiveFilter(title)}
        >
          <p className="filterText">{Translate(title, language)}</p>
        </div>
      ))}
    </div>
  );
};

export default Tab;
