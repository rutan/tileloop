import * as React from 'react';
import { useContext } from 'react';
import { setResultFile, store } from '../../store';
import styles from './ResultModal.module.css';

export const ResultModal = () => {
  const { state, dispatch } = useContext(store);

  return (
    <div>
      {state.resultFile ? (
        <React.Fragment>
          <button
            className={styles.cover}
            type="button"
            aria-label="閉じる"
            onClick={() => {
              dispatch(setResultFile(''));
            }}
          />
          <div className={styles.box}>
            <div
              className={styles.preview}
              style={{
                backgroundImage: `url(${state.resultFile})`,
              }}
            />
            <a className={styles.button} href={state.resultFile} download="download">
              ダウンロード
            </a>
          </div>
        </React.Fragment>
      ) : null}
    </div>
  );
};
