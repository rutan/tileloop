import 'regenerator-runtime/runtime';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from './store';
import { App } from './components/App';

(() => {
  ReactDOM.render(
    <Provider>
      <App />
    </Provider>,
    document.getElementById('root')
  );
})();
