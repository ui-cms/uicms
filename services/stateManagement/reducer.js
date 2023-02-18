import { initialState } from "./initialState";

export default function reducer(state, { type, payload }) {
  switch (type) {
    case "reset": {
      return { ...initialState };
    }
    case "setCurrentUser": {
      return { ...state, currentUser: payload };
    }
    case "setAuthToken": {
      return { ...state, authToken: payload };
    }
    default:
      return state;
  }
}
