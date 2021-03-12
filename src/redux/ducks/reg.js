// Types
export const Types = {
  SET_REG: 'reg/SET_REG',
};

const INITIAL_STATE = {
  reg: null,
};

// reducers

export default function reg(state = INITIAL_STATE, action) {
  if (action.type === Types.SET_REG) {
    return {
      ...state,
      reg: action.payload,
    };
  } else {
    return state;
  }
}

// actions

export const Creators = {
  // eslint-disable-next-line no-shadow
  setReg: reg => ({
    type: Types.SET_REG,
    payload: reg,
  }),
};
