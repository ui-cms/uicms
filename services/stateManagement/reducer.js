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
    case "setRepos": {
      return { ...state, repos: payload };
    }
    default:
      return state;
  }
}
