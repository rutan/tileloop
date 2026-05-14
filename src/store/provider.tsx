import { createContext, default as React, useReducer } from 'react';
import { Actions } from './actions';
import { reducer } from './reducer';
import { initialState } from './state';

export const store = createContext({
  state: initialState,
  dispatch: (_action: Actions) => {},
});
const { Provider: StoreProvider } = store;

export const Provider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <StoreProvider value={{ state, dispatch }}>{children}</StoreProvider>;
};
