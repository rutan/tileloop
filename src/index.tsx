import { createRoot } from 'react-dom/client';
import 'ress/ress.css';
import { App } from './components/app/App';
import { Provider } from './store';
import { ThemeProvider } from './theme';
import './styles/global.css';

(() => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element was not found.');
  }

  createRoot(rootElement).render(
    <ThemeProvider>
      <Provider>
        <App />
      </Provider>
    </ThemeProvider>,
  );
})();
