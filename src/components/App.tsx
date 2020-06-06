import * as React from 'react';
import styled from '@emotion/styled';
import { GlobalStyle } from './GlobalStyle';
import { PicturePreview } from './organisms/PicturePreview';
import { ResultModal } from './organisms/ResultModal';
import { SCREEN_WIDTH_SMARTPHONE } from '../constants';
import { EditTabGroup } from './organisms/EditTabGroup';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;

  @media (max-width: ${SCREEN_WIDTH_SMARTPHONE}px) {
    flex-direction: column;
  }
`;

const PreviewArea = styled.div`
  width: 50%;
  height: 100%;
  overflow: auto;
  background: #e1e1e1;

  @media (max-width: ${SCREEN_WIDTH_SMARTPHONE}px) {
    width: 100%;
    height: 50%;
  }
`;

const EditArea = styled.div`
  position: relative;
  z-index: 10;
  width: 50%;
  height: 100%;
  overflow: auto;
  background: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

  @media (max-width: ${SCREEN_WIDTH_SMARTPHONE}px) {
    width: 100%;
    height: 50%;
  }
`;

export const App = () => {
  return (
    <Container>
      <GlobalStyle />
      <PreviewArea>
        <PicturePreview />
      </PreviewArea>
      <EditArea>
        <EditTabGroup />
      </EditArea>
      <ResultModal />
    </Container>
  );
};
