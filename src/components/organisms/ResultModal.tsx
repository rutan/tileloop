import * as React from 'react';
import styled from '@emotion/styled';
import { useContext } from 'react';
import { setResultFile, store } from '../../store';

const Container = styled.div``;

const Cover = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
`;

const Box = styled.div`
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  width: 100%;
  max-width: 600px;
  border-radius: 10px;
  padding: 15px;
`;

const Preview = styled.div`
  display: block;
  width: 100%;
  height: 300px;
  margin-bottom: 15px;
  background: no-repeat center center;
  background-size: contain;
`;

const Button = styled.a`
  display: block;
  margin: 0 auto;
  text-align: center;
  width: 200px;
  height: 50px;
  line-height: 50px;
  text-decoration: none;
  background: #6cf;
  color: #fff;
  border-radius: 25px;
`;

export const ResultModal = () => {
  const { state, dispatch } = useContext(store);

  return (
    <Container>
      {state.resultFile ? (
        <React.Fragment>
          <Cover
            onClick={() => {
              dispatch(setResultFile(''));
            }}
          />
          <Box>
            <Preview
              style={{
                backgroundImage: `url(${state.resultFile})`,
              }}
            />
            <Button href={state.resultFile} download="download">
              ダウンロード
            </Button>
          </Box>
        </React.Fragment>
      ) : null}
    </Container>
  );
};
