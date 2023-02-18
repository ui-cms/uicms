export default class Actions {
  constructor(dispatch) {
    this.dispatch = dispatch;
  }

  reset() {
    this.dispatch({ type: "reset" });
  }

  // Auth and current user
  setAuthToken(authToken) {
    this.dispatch({ type: "setAuthToken", payload: authToken });
  }
  setCurrentUser(currentUser) {
    this.dispatch({ type: "setCurrentUser", payload: currentUser });
  }
}
