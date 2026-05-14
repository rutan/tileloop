import styled from '@emotion/styled';
import * as React from 'react';
import { useState } from 'react';
import { ParameterForm } from './ParameterForm';
import { PictureForm } from './PictureForm';

type TabKey = 'pictures' | 'parameters';

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 10px 20px;
`;

const Tabs = styled.div`
  width: 100%;
  height: 100%;
`;

const TabList = styled.div`
  margin: 0 -10px;
  display: flex;
`;

const Tab = styled.button<{ selected: boolean }>`
  width: calc(50% - 10px * 2);
  height: 40px;
  margin: 0 10px 10px;
  padding: 0;
  line-height: 40px;
  text-align: center;
  border-bottom: 2px solid ${({ selected }: { selected: boolean }) => (selected ? '#388e3c' : 'transparent')};
  transition: all 0.2s ease-in-out;
  color: ${({ selected }: { selected: boolean }) => (selected ? '#388e3c' : '#999')};
  font-size: 14px;
`;

const TabPanel = styled.div`
  width: 100%;
  height: calc(100% - 50px - 10px);
  overflow-y: auto;
`;

export const EditTabGroup = () => {
  const [selectedTab, setSelectedTab] = useState<TabKey>('pictures');

  return (
    <Container>
      <Tabs>
        <TabList role="tablist">
          <Tab
            type="button"
            role="tab"
            selected={selectedTab === 'pictures'}
            aria-selected={selectedTab === 'pictures'}
            aria-controls="pictures-panel"
            id="pictures-tab"
            tabIndex={selectedTab === 'pictures' ? 0 : -1}
            onClick={() => {
              setSelectedTab('pictures');
            }}
          >
            画像の選択
          </Tab>
          <Tab
            type="button"
            role="tab"
            selected={selectedTab === 'parameters'}
            aria-selected={selectedTab === 'parameters'}
            aria-controls="parameters-panel"
            id="parameters-tab"
            tabIndex={selectedTab === 'parameters' ? 0 : -1}
            onClick={() => {
              setSelectedTab('parameters');
            }}
          >
            詳細設定
          </Tab>
        </TabList>
        {selectedTab === 'pictures' ? (
          <TabPanel id="pictures-panel" role="tabpanel" aria-labelledby="pictures-tab">
            <PictureForm />
          </TabPanel>
        ) : (
          <TabPanel id="parameters-panel" role="tabpanel" aria-labelledby="parameters-tab">
            <ParameterForm />
          </TabPanel>
        )}
      </Tabs>
    </Container>
  );
};
