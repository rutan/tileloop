import * as React from 'react';
import styles from './EditPanel.module.css';
import { ParameterForm } from './ParameterForm';
import { PictureForm } from './PictureForm';

interface Props {
  isExporting: boolean;
  onExport: () => Promise<void>;
}

export const EditPanel: React.FC<Props> = ({ isExporting, onExport }) => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>TileLoop</h1>
          <p className={styles.subtitle}>画像を並べてタイル画像を書き出す</p>
        </div>
        <button
          className={styles.exportButton}
          type="button"
          disabled={isExporting}
          onClick={() => {
            void onExport();
          }}
        >
          {isExporting ? '作成中...' : 'PNGを書き出す'}
        </button>
      </header>

      <div className={styles.body}>
        <section className={styles.section}>
          <PictureForm />
        </section>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>設定</h2>
          <ParameterForm />
        </section>
      </div>
    </div>
  );
};
