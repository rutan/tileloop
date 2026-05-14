import * as React from 'react';
import { createRoot } from 'react-dom/client';
import 'ress/ress.css';
import { App } from './components/App';
import { Provider } from './store';
import './styles/global.css';

(() => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element was not found.');
  }

  createRoot(rootElement).render(
    <Provider>
      <App />
    </Provider>,
  );
})();
