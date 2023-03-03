import { initialState } from "./initialState";

export default function reducer(state, { type, payload }) {
  switch (type) {
    case "reset": {
      return { ...initialState };
    }
    case "setCurrentUser": {
      const { login, html_url, avatar_url } = payload; // limit to only needed/used properties
      return { ...state, currentUser: { login, html_url, avatar_url } };
    }
    case "setAuthToken": {
      return { ...state, authToken: payload };
    }
    case "setRepos": {
      // limit to only needed/used properties
      const repos = payload.map((r) => ({
        id: r.id,
        name: r.name,
        owner: r.owner.login,
        full_name: r.full_name,
        description: r.description,
        private: r.private,
        topics: r.topics,
        html_url: r.html_url,
        homepage: r.homepage,
        configFile: { data: null, sha: null }, // SHA blob of config file. Use it to update file content.
      }));
      return { ...state, repos };
    }
    case "updateRepo": {
      const repos = state.repos.map((r) => (r.id === payload.id ? payload : r));
      return { ...state, repos };
    }
    default:
      return state;
  }
}
