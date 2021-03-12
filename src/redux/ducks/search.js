// Types
export const Types = {
  ADD_USER_SEARCH: 'search/ADD_USER_SEARCH',
  RESET_USER_SEARCH: 'search/RESET_USER_SEARCH',
  DEL_USER_SEARCH: 'search/DEL_USER_SEARCH',
  DEL_USER_SEARCH_OPER: 'search/DEL_USER_SEARCH_OPER',

  ADD_JOB_SEARCH: 'search/ADD_JOB_SEARCH',
  RESET_JOB_SEARCH: 'search/RESET_JOB_SEARCH',
  DEL_JOB_SEARCH: 'search/DEL_JOB_SEARCH',
  DEL_JOB_SEARCH_OPER: 'search/DEL_JOB_SEARCH_OPER',
};

const INITIAL_STATE = {
  user: [],
  job: null,
};

// reducers

export default function search(state = INITIAL_STATE, action) {
  if (action.type === Types.RESET_USER_SEARCH) {
    return {
      ...state,
      user: [],
    };
  } else if (action.type === Types.ADD_USER_SEARCH) {
    return {
      ...state,
      user: [...state.user, action.payload.item],
    };
  } else if (action.type === Types.DEL_USER_SEARCH) {
    return {
      ...state,
      user: state.user.filter(
        item =>
          item.attr !== action.payload.item.attr ||
          item.opr !== action.payload.item.opr ||
          item.val !== action.payload.item.val,
      ),
    };
  } else if (action.type === Types.DEL_USER_SEARCH_OPER) {
    return {
      ...state,
      user: state.user.filter(
        item =>
          item.attr !== action.payload.item.attr ||
          item.opr !== action.payload.item.opr,
      ),
    };
  } else if (action.type === Types.RESET_JOB_SEARCH) {
    return {
      ...state,
      job: null,
    };
  } else if (action.type === Types.ADD_JOB_SEARCH) {
    return {
      ...state,
      job: action.payload.item,
    };
  } else if (action.type === Types.DEL_JOB_SEARCH) {
    return {
      ...state,
      job: null,
    };
  } else {
    return state;
  }
}

// actions

export const Creators = {
  addUserSearch: item => ({
    type: Types.ADD_USER_SEARCH,
    payload: {item},
  }),

  delUserSearch: item => ({
    type: Types.DEL_USER_SEARCH,
    payload: {item},
  }),

  delUserSearchOper: item => ({
    type: Types.DEL_USER_SEARCH_OPER,
    payload: {item},
  }),

  resetUserSearch: () => ({
    type: Types.RESET_USER_SEARCH,
  }),

  addJobSearch: item => ({
    type: Types.ADD_JOB_SEARCH,
    payload: {item},
  }),

  delJobSearch: item => ({
    type: Types.DEL_JOB_SEARCH,
    payload: {item},
  }),

  delJobSearchOper: item => ({
    type: Types.DEL_JOB_SEARCH_OPER,
    payload: {item},
  }),

  resetJobSearch: () => ({
    type: Types.RESET_JOB_SEARCH,
  }),
};
