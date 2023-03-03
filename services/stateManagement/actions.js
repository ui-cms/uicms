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
}
