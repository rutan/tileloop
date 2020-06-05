import { createContext, default as React, useReducer } from 'react';
import { initialState } from './state';
import { Actions } from './actions';
import { reducer } from './reducer';

export const store = createContext({
  state: initialState,
  dispatch: (action: Actions) => {},
});
const { Provider: StoreProvider } = store;

export const Provider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <StoreProvider value={{ state, dispatch }}>{children}</StoreProvider>;
};
