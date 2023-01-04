import {
  LOADING,
  LOADED,
  ERROR,
  PHONE_NUMBER_ERROR,
  CREATE_USER_LOADING,
  CREATE_USER_ERROR,
  UPDATE_USER,
  LOGIN,
  LOGOUT,
  ACCESS_TOKEN,
} from "../action/actionType";

const initialState = {
  type: null,
  accessToken: null,
  refreshToken: null,
  isLoading: true,
  isAuthentication: false,
  user: null,
  isError: false,
  error: null,
};

export default (preState = initialState, action) => {
  switch (action.type) {
    case LOADING: {
      return { ...preState, isLoading: true, isError: false, error: null };
    }
    case LOADED: {
      return {
        ...preState,
        isLoading: false,
        isAuthentication: false,
        isError: false,
        error: null,
      };
    }
    case ERROR: {
      return {
        ...preState,
        isError: true,
        isLoading: false,
        error: action.payload,
      };
    }
    case PHONE_NUMBER_ERROR: {
      return {
        ...preState,
        isLoading: false,
        isError: true,
        error: action.payload,
      };
    }
    case CREATE_USER_LOADING: {
      return {
        ...preState,
        user: action.payload,
        isLoading: false,
        isError: false,
        error: null,
      };
    }
    case CREATE_USER_ERROR: {
      return {
        ...preState,
        isLoading: false,
        isError: true,
        error: action.payload,
      };
    }
    case UPDATE_USER: {
      return {
        ...preState,
        user: {
          ...preState.user,
          ...action.payload,
        },
        isLoading: false,
        isError: false,
        error: null,
      };
    }
    case LOGIN: {
      return {
        ...preState,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isLoading: false,
        isAuthentication: action.payload.accessToken != null,
        user: { ...preState.user, ...action.payload.user },
        type: action.payload.type,
        isError: false,
        error: null,
      };
    }
    case LOGOUT: {
      return { ...initialState, user: preState.user, isLoading: false };
    }
    case ACCESS_TOKEN: {
      return {
        ...preState,
        accessToken: action.payload,
        isLoading: false,
        isError: false,
        error: null,
      };
    }
    default: {
      return preState;
    }
  }
};
