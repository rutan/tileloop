import * as React from 'react';
import styled from '@emotion/styled';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { ClassNames, css } from '@emotion/core';
import { useContext } from 'react';
import { store } from '../../store';
import { PictureForm } from './PictureForm';
import { ParameterForm } from './ParameterForm';

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 10px 20px;
`;

const TabsStyle = css`
  width: 100%;
  height: 100%;
`;

const TabListStyle = css`
  margin: 0 -10px;
  display: flex;
  list-style: none;
`;

const TabStyle = css`
  width: calc(50% - 10px * 2);
  height: 40px;
  margin: 0 10px 10px;
  line-height: 40px;
  text-align: center;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease-in-out;
  color: #999;
  font-size: 14px;

  &[aria-selected='true'] {
    border-bottom-color: #388e3c;
    color: #388e3c;
  }
`;

const TabPanelStyle = css`
  width: 100%;
  overflow-y: auto;

  &.react-tabs__tab-panel--selected {
    height: calc(100% - 50px - 10px);
  }
`;

export const EditTabGroup = () => {
  const { state, dispatch } = useContext(store);

  return (
    <Container>
      <ClassNames>
        {({ css }) => (
          <Tabs
            className={css`
              ${TabsStyle}
            `}
          >
            <TabList
              className={css`
                ${TabListStyle}
              `}
            >
              <Tab
                className={css`
                  ${TabStyle}
                `}
              >
                画像の選択
              </Tab>
              <Tab
                className={css`
                  ${TabStyle}
                `}
              >
                詳細設定
              </Tab>
            </TabList>
            <TabPanel
              className={css`
                ${TabPanelStyle}
              `}
            >
              <PictureForm />
            </TabPanel>
            <TabPanel
              className={css`
                ${TabPanelStyle}
              `}
            >
              <ParameterForm />
            </TabPanel>
          </Tabs>
        )}
      </ClassNames>
    </Container>
  );
};
