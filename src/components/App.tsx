import * as React from 'react';
import styles from './App.module.css';
import { EditTabGroup } from './organisms/EditTabGroup';
import { PicturePreview } from './organisms/PicturePreview';
import { ResultModal } from './organisms/ResultModal';

export const App = () => {
  return (
    <div className={styles.container}>
      <div className={styles.previewArea}>
        <PicturePreview />
      </div>
      <div className={styles.editArea}>
        <EditTabGroup />
      </div>
      <ResultModal />
    </div>
  );
};
