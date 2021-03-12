// Types
export const Types = {
  SET_FOCUS: 'focus/SET_FOCUS',
  UNSET_FOCUS: 'focus/UNSET_FOCUS',
};

const INITIAL_STATE = {
  focus: null,
};

// reducers

export default function focus(state = INITIAL_STATE, action) {
  if (action.type === Types.SET_FOCUS) {
    return {
      ...state,
      focus: action.payload,
    };
  } else if (action.type === Types.UNSET_FOCUS) {
    return {
      ...state,
      focus: null,
    };
  } else {
    return state;
  }
}

// actions

export const Creators = {
  // eslint-disable-next-line no-shadow
  setFocus: focus => ({
    type: Types.SET_FOCUS,
    payload: focus,
  }),

  unsetFocus: () => ({
    type: Types.UNSET_FOCUS,
  }),
};
