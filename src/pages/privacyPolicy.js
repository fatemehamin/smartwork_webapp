import React from "react";
import AppBar from "../components/appBar";
import { useSelector } from "react-redux";
import { Translate } from "../features/i18n/translate";

const PrivacyPolicy = () => {
  const { language } = useSelector((state) => state.i18n);

  return (
    <>
      <AppBar label="privacyPolicy" type="AUTH" />
      <div className="text-align" style={{ margin: 20 }}>
        {Translate("privacyPolicyDescription", language)}
      </div>
    </>
  );
};

export default PrivacyPolicy;
