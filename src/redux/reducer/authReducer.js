import {
  LOADING,
  LOADED,
  ERROR,
  CREATE_USER_LOADING,
  UPDATE_USER,
  LOGIN,
  LOGOUT,
  ACCESS_TOKEN,
} from '../action/actionType';

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
      return {...preState, isLoading: true};
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
        error: {
          ...preState.error,
          ...action.payload,
        },
      };
    }
    case CREATE_USER_LOADING: {
      return {...preState, user: action.payload, isLoading: false};
    }
    case UPDATE_USER: {
      return {
        ...preState,
        user: {
          ...preState.user,
          ...action.payload,
        },
        isLoading: false,
      };
    }
    case LOGIN: {
      return {
        ...preState,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isLoading: false,
        isAuthentication: true,
        user: {...preState.user, ...action.payload.user},
        type: action.payload.type,
      };
    }
    case LOGOUT: {
      return {...initialState, user: preState.user, isLoading: false};
    }
    case ACCESS_TOKEN: {
      return {...preState, accessToken: action.payload, isLoading: false};
    }
    default: {
      return preState;
    }
  }
};
