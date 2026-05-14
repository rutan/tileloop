import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from './store';
import { App } from './components/App';

(() => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element was not found.');
  }

  createRoot(rootElement).render(
    <Provider>
      <App />
    </Provider>
  );
})();
