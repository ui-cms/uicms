import { RepoConfigFile } from "@/helpers/models";
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
        pushed_at: r.pushed_at, // last update date (last commit)
        config: new RepoConfigFile(),
      }));
      return { ...state, repos };
    }
    case "updateRepo": {
      const repos = state.repos.map((r) => (r.id === payload.id ? payload : r));
      return { ...state, repos };
    }
    case "setItems": {
      const items = { ...state.items };
      items[payload.repoId] = items[payload.repoId] ?? {}; // if repoId not present, the use start id with empty object
      items[payload.repoId][payload.collectionId] = payload.items;
      return { ...state, items };
    }
    case "setSelectedRepo": {
      return { ...state, selectedRepo: payload };
    }
    case "setSelectedCollection": {
      return { ...state, selectedCollection: payload };
    }
    case "setSelectedItem": {
      return { ...state, selectedItem: payload };
    }
    default:
      return state;
  }
}
