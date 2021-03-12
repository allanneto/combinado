// Types
export const Types = {
  SET_REQUEST: 'auth/SET_REQUEST',
  SET_SUCCESS: 'auth/SET_SUCCESS',
  UPDATE_USER: 'auth/UPDATE_USER',
  SIGN_OUT: 'auth/SIGN_OUT',
};

const INITIAL_STATE = {
  user: null,
};

// reducers

export default function auth(state = INITIAL_STATE, action) {
  if (action.type === Types.SET_REQUEST) {
    return state;
  } else if (action.type === Types.SET_SUCCESS) {
    return {
      ...state,
      user: action.payload.data,
    };
  } else if (action.type === Types.UPDATE_USER) {
    return {
      ...state,
      user: {...state.user, ...action.payload.data},
    };
  } else if (action.type === Types.SIGN_OUT) {
    return {
      ...state,
      user: null,
    };
  } else {
    return state;
  }
}

// actions

export const Creators = {
  // eslint-disable-next-line no-shadow
  setSessionRequest: auth => ({
    type: Types.SET_REQUEST,
    payload: {auth},
  }),

  setSessionSuccess: data => ({
    type: Types.SET_SUCCESS,
    payload: {data},
  }),

  udateCurrentUser: data => ({
    type: Types.UPDATE_USER,
    payload: {data},
  }),

  signOut: () => ({
    type: Types.SIGN_OUT,
  }),
};
