import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { init } from "../redux/action/authAction";

export default () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.authReducer);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(init());
    !authState.isLoading && authState.isAuthentication
      ? authState.type === "boss"
        ? navigate("/manager")
        : navigate("/myTasks")
      : navigate("/login");
  }, [authState.isLoading]);
};
