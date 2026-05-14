import * as React from 'react';
import styles from './HelpModal.module.css';

interface Props {
  onClose: () => void;
}

export const HelpModal: React.FC<Props> = ({ onClose }) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <React.Fragment>
      <button className={styles.cover} type="button" aria-label="ヘルプを閉じる" onClick={onClose} />
      <div className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="help-title">
        <header className={styles.header}>
          <h2 className={styles.title} id="help-title">
            ヘルプ
          </h2>
          <button className={styles.closeButton} type="button" aria-label="閉じる" onClick={onClose}>
            ×
          </button>
        </header>

        <div className={styles.body}>
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>画像</h3>
            <p className={styles.text}>
              画像を追加すると、プレビューにタイル状に並びます。ドラッグ&ドロップでも追加できます。
            </p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>設定</h3>
            <ul className={styles.list}>
              <li>用途で出力サイズを選べます。</li>
              <li>配置でグリッドまたはずらしグリッドを切り替えられます。</li>
              <li>詳細設定でサイズ、余白、角丸、色、シャドウを調整できます。</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>書き出し</h3>
            <p className={styles.text}>
              「画像を保存する」を押すと、現在のプレビュー設定で画像を作成します。作成後に表示される画面からダウンロードできます。
            </p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>このアプリについて</h3>
            <ul className={styles.list}>
              <li>
                つくったひと：Ruたん（ X:{' '}
                <a href="https://x.com/ru_shalm" target="_blank" rel="noopener noreferrer">
                  @ru_shalm
                </a>{' '}
                ）
              </li>
              <li>
                ソースコード：
                <a href="https://github.com/rutan/tileloop" target="_blank" rel="noopener noreferrer">
                  rutan/tileloop
                </a>
              </li>
            </ul>
            <p className={styles.text}>
              このアプリで作成した画像は、個人利用・商用利用問わず自由にお使いいただけます。クレジット表記も不要です。
            </p>
          </section>
        </div>
      </div>
    </React.Fragment>
  );
};
