export default class Actions {
  constructor(dispatch) {
    this.dispatch = dispatch;
  }

  reset() {
    this.dispatch({ type: "reset" });
  }
  setAuthToken(authToken) {
    this.dispatch({ type: "setAuthToken", payload: authToken });
  }
  setCurrentUser(currentUser) {
    this.dispatch({ type: "setCurrentUser", payload: currentUser });
  }
  setRepos(repos) {
    this.dispatch({ type: "setRepos", payload: repos });
  }
  updateRepo(repo) {
    this.dispatch({ type: "updateRepo", payload: repo });
  }
  setItems(repoId, collectionId, items) {
    this.dispatch({
      type: "setItems",
      payload: { repoId, collectionId, items },
    });
  }
  setSelectedRepo(repo) {
    this.dispatch({ type: "setSelectedRepo", payload: repo });
  }
  setSelectedCollection(collection) {
    this.dispatch({ type: "setSelectedCollection", payload: collection });
  }
  setSelectedItem(item) {
    this.dispatch({ type: "setSelectedItem", payload: item });
  }
}
