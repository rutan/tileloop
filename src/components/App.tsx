import * as React from 'react';
import { useContext } from 'react';
import { store } from '../store';
import styled from '@emotion/styled';
import { GlobalStyle } from './GlobalStyle';
import { PicturePreview } from './organisms/PicturePreview';
import { ResultModal } from './organisms/ResultModal';
import { ParameterForm } from './organisms/ParameterForm';
import { PictureForm } from './organisms/PictureForm';

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const PreviewArea = styled.div`
  width: 100%;
  height: 50%;
  overflow: auto;
  background: #e1e1e1;
`;

const EditArea = styled.div`
  width: 100%;
  height: 50%;
  overflow: auto;
  background: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
`;

export const App = () => {
  // const {state} = useContext(store);
  // const {pictures} = state;

  return (
    <Container>
      <GlobalStyle />
      <PreviewArea>
        <PicturePreview />
      </PreviewArea>
      <EditArea>
        <PictureForm />
        <ParameterForm />
      </EditArea>
      <ResultModal />
    </Container>
  );
};
