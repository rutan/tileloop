import { ClassNames, css } from '@emotion/react';
import styled from '@emotion/styled';
import * as React from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { ParameterForm } from './ParameterForm';
import { PictureForm } from './PictureForm';

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
  return (
    <Container>
      <ClassNames>
        {(styles) => (
          <Tabs
            className={styles.css`
              ${TabsStyle}
            `}
          >
            <TabList
              className={styles.css`
                ${TabListStyle}
              `}
            >
              <Tab
                className={styles.css`
                  ${TabStyle}
                `}
              >
                画像の選択
              </Tab>
              <Tab
                className={styles.css`
                  ${TabStyle}
                `}
              >
                詳細設定
              </Tab>
            </TabList>
            <TabPanel
              className={styles.css`
                ${TabPanelStyle}
              `}
            >
              <PictureForm />
            </TabPanel>
            <TabPanel
              className={styles.css`
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
