import { Global } from '@emotion/react';
import * as React from 'react';
import { globalCss } from './globalCss';
import { resetCss } from './resetCss';

export const GlobalStyle = () => (
  <React.Fragment>
    <Global styles={resetCss} />
    <Global styles={globalCss} />
  </React.Fragment>
);
