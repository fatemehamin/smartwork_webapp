import React from "react";
import { Badge } from "@mui/material";
import { useSelector } from "react-redux";
import { Translate } from "../features/i18n/translate";
import "./tabs.css";

const Tabs = ({ tabs, activeTab, onSwitchTab }) => {
  const { language } = useSelector((state) => state.i18n);

  return (
    <div className="filterContainer">
      {tabs.map((tab, index) => (
        <div
          key={index}
          className={`filter ${activeTab === tab.title && "activeTab"}`}
          style={{ width: `${100 / tabs.length}%` }}
          onClick={() => onSwitchTab(tab.title)}
        >
          <Badge color="secondary" variant="dot" invisible={!tab.isBadge}>
            <p className="filterText">{Translate(tab.title, language)}</p>
          </Badge>
        </div>
      ))}
    </div>
  );
};

export default Tabs;
