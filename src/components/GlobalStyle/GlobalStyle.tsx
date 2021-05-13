import * as React from 'react';
import { Global } from '@emotion/react';
import { resetCss } from './resetCss';
import { globalCss } from './globalCss';

export const GlobalStyle = () => (
  <React.Fragment>
    <Global styles={resetCss} />
    <Global styles={globalCss} />
  </React.Fragment>
);
