import { App } from './components/app/App';
import { Provider } from './store';
import { ThemeProvider } from './theme';

export const AppRoot = () => (
  <ThemeProvider>
    <Provider>
      <App />
    </Provider>
  </ThemeProvider>
);
