// The reason initialState is its own file not in StateManagement.js is "require cycle issue..."
// Because initialState object is used both in StateManagement component and in "reset" action in reducer.js

export const initialState = {
  authToken: null,
  currentUser: null,
  repos: [],
  items: {}, // item names (id + slug) per repo/collection. E.g: { repoId1: { collectionId1: [item1, item2] } }
  selectedRepo: null,
  selectedCollection: null,
  selectedItem: null,
};
