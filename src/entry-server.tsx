import { renderToString } from 'react-dom/server';
import 'ress/ress.css';
import { AppRoot } from './AppRoot';
import './styles/global.css';

export function render() {
  return renderToString(<AppRoot />);
}
