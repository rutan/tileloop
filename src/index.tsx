import { createRoot, hydrateRoot } from 'react-dom/client';
import 'ress/ress.css';
import { AppRoot } from './AppRoot';
import './styles/global.css';

(() => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element was not found.');
  }

  if (rootElement.childElementCount > 0) {
    hydrateRoot(rootElement, <AppRoot />);
    return;
  }

  createRoot(rootElement).render(<AppRoot />);
})();
