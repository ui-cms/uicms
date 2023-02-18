// The reason initialState is its own file not in StateManagement.js is "require cycle issue..."
// Because initialState object is used both in StateManagement component and in "reset" action in reducer.js

export const initialState = {
  authToken: null,
  currentUser: null,
};