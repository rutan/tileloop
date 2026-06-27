import { X } from 'lucide-react';
import { FC, Fragment, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './HelpModal.module.css';

interface Props {
  onClose: () => void;
}

export const HelpModal: FC<Props> = ({ onClose }) => {
  useEffect(() => {
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

  if (typeof document === 'undefined') return null;

  return createPortal(
    <Fragment>
      <button className={styles.cover} type="button" aria-label="ヘルプを閉じる" onClick={onClose} />
      <dialog className={styles.dialog} open aria-labelledby="help-title">
        <header className={styles.header}>
          <h2 className={styles.title} id="help-title">
            TileLoopについて
          </h2>
          <button className={styles.closeButton} type="button" aria-label="閉じる" onClick={onClose}>
            <X className={styles.closeIcon} aria-hidden="true" strokeWidth={2.5} />
          </button>
        </header>

        <div className={styles.body}>
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>画像</h3>
            <p className={styles.text}>
              「画像を追加」から使いたい画像を選ぶと、プレビューにタイル状に並びます。ドラッグ&ドロップや貼り付けでも追加できます。
            </p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>配置</h3>
            <ul className={styles.list}>
              <li>出力サイズはプリセットから選べます。必要な場合はカスタムで幅と高さを指定できます。</li>
              <li>並べ方は「整列グリッド」と「ずらしグリッド」から選べます。</li>
              <li>「並びをシャッフル」で画像の並び順を変えられます。</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>調整</h3>
            <ul className={styles.list}>
              <li>タイルの画像サイズ、回転、余白、角丸、不透明度を調整できます。</li>
              <li>背景の色、不透明度を変更できます。</li>
              <li>画像の影は色、ぼかし、位置を調整できます。</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>保存</h3>
            <p className={styles.text}>
              「画像を作成する」を押すと、現在の設定で画像を作成します。作成後はプレビューを確認して、ダウンロードできます。
            </p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>このアプリについて</h3>
            <ul className={styles.list}>
              <li>
                つくったひと：Ruたん（X:{' '}
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
      </dialog>
    </Fragment>,
    document.body,
  );
};
