import * as React from 'react';
import { useContext } from 'react';
import { setResultFile, store } from '../../store';
import styles from './ResultModal.module.css';

export const ResultModal = () => {
  const { state, dispatch } = useContext(store);
  const closeModal = React.useCallback(() => {
    dispatch(setResultFile(''));
  }, [dispatch]);

  React.useEffect(() => {
    if (!state.resultFile) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeModal, state.resultFile]);

  return (
    <React.Fragment>
      {state.resultFile ? (
        <React.Fragment>
          <button className={styles.cover} type="button" aria-label="作成完了画面を閉じる" onClick={closeModal} />
          <div className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="result-title">
            <header className={styles.header}>
              <h2 className={styles.title} id="result-title">
                画像ができたよ！
              </h2>
              <button className={styles.closeButton} type="button" aria-label="閉じる" onClick={closeModal}>
                ×
              </button>
            </header>

            <div
              className={styles.preview}
              style={{
                backgroundImage: `url(${state.resultFile})`,
              }}
            />
            <div className={styles.actions}>
              <button className={styles.secondaryButton} type="button" onClick={closeModal}>
                閉じる
              </button>
              <a className={styles.downloadButton} href={state.resultFile} download="tileloop.png">
                ダウンロード
              </a>
            </div>
          </div>
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );
};
