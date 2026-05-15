import { CircleQuestionMark } from 'lucide-react';
import { useState } from 'react';
import styles from './Header.module.css';
import { HelpModal } from './HelpModal';

export const Header = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <header className={styles.container}>
      <h1 className={styles.title}>TileLoop</h1>
      <button
        className={styles.helpButton}
        type="button"
        aria-label="ヘルプを開く"
        aria-haspopup="dialog"
        onClick={() => {
          setIsHelpOpen(true);
        }}
      >
        <CircleQuestionMark className={styles.helpIcon} aria-hidden="true" strokeWidth={2.3} />
      </button>

      {isHelpOpen ? (
        <HelpModal
          onClose={() => {
            setIsHelpOpen(false);
          }}
        />
      ) : null}
    </header>
  );
};
