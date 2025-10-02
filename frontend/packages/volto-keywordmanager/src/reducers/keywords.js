import {
  GET_KEYWORDS,
  PATCH_KEYWORDS,
  DELETE_KEYWORDS,
} from '../constants/ActionTypes';

const initialState = {
  error: null,
  loaded: false,
  loading: false,
  items: [],
};

export default function keywords(state = initialState, action = {}) {
  switch (action.type) {
    case `${GET_KEYWORDS}_PENDING`:
      return {
        ...state,
        error: null,
        loading: true,
        loaded: false,
      };
    case `${GET_KEYWORDS}_SUCCESS`:
      return {
        ...state,
        error: null,
        loading: false,
        loaded: true,
        items: action.result.items,
      };
    case `${GET_KEYWORDS}_FAIL`:
      return {
        ...state,
        error: action.error,
        loading: false,
        loaded: false,
        items: [],
      };
    case `${PATCH_KEYWORDS}_PENDING`:
      return {
        ...state,
        error: null,
        loading: true,
        loaded: false,
      };
    case `${PATCH_KEYWORDS}_SUCCESS`:
      return {
        ...state,
        error: null,
        loading: false,
        loaded: true,
        items: action.result.items,
        changeItems: action.result.changedItems,
      };
    case `${PATCH_KEYWORDS}_FAIL`:
      return {
        ...state,
        error: action.error,
        loading: false,
        loaded: false,
      };
    case `${DELETE_KEYWORDS}_PENDING`:
      return {
        ...state,
        error: null,
        loading: true,
        loaded: false,
      };
    case `${DELETE_KEYWORDS}_SUCCESS`:
      return {
        ...state,
        error: null,
        loading: false,
        loaded: true,
        items: action.result.items,
        changeItems: action.result.changedItems,
      };
    case `${DELETE_KEYWORDS}_FAIL`:
      return {
        ...state,
        error: action.error,
        loading: false,
        loaded: false,
      };
    default:
      return state;
  }
}
