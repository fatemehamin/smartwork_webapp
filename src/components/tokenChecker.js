import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const TokenChecker = () => {
  const { refreshToken } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  useEffect(() => {
    refreshToken === null && navigate("/login");
  }, [refreshToken]);

  return null;
};

export default TokenChecker;
