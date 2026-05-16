import { PencilRuler } from 'lucide-react';
import { FC, useContext } from 'react';
import { setResultFile, store } from '../../store';
import { PanelButton, PanelLinkButton } from '../controls/PanelButton';
import { ActionRow } from './parts/ActionRow';
import { PanelSection } from './parts/PanelSection';
import styles from './SavePanel.module.css';

interface Props {
  isExporting: boolean;
  onExport: () => Promise<void>;
}

export const SavePanel: FC<Props> = ({ isExporting, onExport }) => {
  const { state, dispatch } = useContext(store);
  const { renderParameter, resultFile } = state;
  const layoutLabel = renderParameter.layoutMode === 'grid' ? '整列グリッド' : 'ずらしグリッド';

  if (isExporting) {
    return (
      <div className={styles.container}>
        <output className={styles.loadingPanel} aria-live="polite">
          <span className={styles.spinner} aria-hidden="true" />
          <span>作成中</span>
        </output>
      </div>
    );
  }

  if (resultFile) {
    return (
      <div className={styles.container}>
        <div className={styles.previewFrame}>
          <img className={styles.previewImage} src={resultFile} alt="作成した画像のプレビュー" />
        </div>

        <ActionRow>
          <PanelButton
            variant="secondary"
            type="button"
            onClick={() => {
              dispatch(setResultFile(''));
            }}
          >
            作り直す
          </PanelButton>
          <PanelLinkButton variant="accent" href={resultFile} download="tileloop.png">
            ダウンロード
          </PanelLinkButton>
        </ActionRow>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.summaryStack}>
        <div className={styles.illustration} aria-hidden="true">
          <PencilRuler className={styles.illustrationIcon} />
        </div>

        <PanelSection>
          <dl className={styles.summaryList}>
            <div className={styles.summaryItem}>
              <dt>出力サイズ</dt>
              <dd>
                {renderParameter.width} x {renderParameter.height}px
              </dd>
            </div>
            <div className={styles.summaryItem}>
              <dt>配置</dt>
              <dd>{layoutLabel}</dd>
            </div>
            <div className={styles.summaryItem}>
              <dt>画像</dt>
              <dd>{renderParameter.pictures.length}枚</dd>
            </div>
          </dl>
        </PanelSection>
      </div>

      <PanelButton
        variant="primary"
        type="button"
        onClick={() => {
          void onExport();
        }}
      >
        画像を作成する
      </PanelButton>
    </div>
  );
};
