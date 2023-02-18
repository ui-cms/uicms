import { createContext, useContext, useMemo, useReducer } from "react";
import Actions from "./actions";
import { initialState } from "./initialState";
import reducer from "./reducer";

const StateManagementContext = createContext();

export function StateManagement({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const contextValue = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <StateManagementContext.Provider value={contextValue}>
      {children}
    </StateManagementContext.Provider>
  );
}

export default function useStateManagement() {
  const { state, dispatch } = useContext(StateManagementContext);
  return { state, dispatchAction: new Actions(dispatch) }; // useMemo won't help here
}
