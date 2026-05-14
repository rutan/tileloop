import * as React from 'react';
import { useState } from 'react';
import styles from './EditTabGroup.module.css';
import { ParameterForm } from './ParameterForm';
import { PictureForm } from './PictureForm';

type TabKey = 'pictures' | 'parameters';

export const EditTabGroup = () => {
  const [selectedTab, setSelectedTab] = useState<TabKey>('pictures');

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <div className={styles.tabList} role="tablist">
          <button
            className={[styles.tab, selectedTab === 'pictures' ? styles.selected : ''].filter(Boolean).join(' ')}
            type="button"
            role="tab"
            aria-selected={selectedTab === 'pictures'}
            aria-controls="pictures-panel"
            id="pictures-tab"
            tabIndex={selectedTab === 'pictures' ? 0 : -1}
            onClick={() => {
              setSelectedTab('pictures');
            }}
          >
            画像の選択
          </button>
          <button
            className={[styles.tab, selectedTab === 'parameters' ? styles.selected : ''].filter(Boolean).join(' ')}
            type="button"
            role="tab"
            aria-selected={selectedTab === 'parameters'}
            aria-controls="parameters-panel"
            id="parameters-tab"
            tabIndex={selectedTab === 'parameters' ? 0 : -1}
            onClick={() => {
              setSelectedTab('parameters');
            }}
          >
            詳細設定
          </button>
        </div>
        {selectedTab === 'pictures' ? (
          <div className={styles.tabPanel} id="pictures-panel" role="tabpanel" aria-labelledby="pictures-tab">
            <PictureForm />
          </div>
        ) : (
          <div className={styles.tabPanel} id="parameters-panel" role="tabpanel" aria-labelledby="parameters-tab">
            <ParameterForm />
          </div>
        )}
      </div>
    </div>
  );
};
