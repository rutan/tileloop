import { CircleQuestionMark, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../../theme';
import styles from './Header.module.css';
import { HelpModal } from './HelpModal';

export const Header = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const { effectiveTheme, toggleTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';

  return (
    <header className={styles.container}>
      <h1 className={styles.title}>TileLoop</h1>
      <button
        className={styles.iconButton}
        type="button"
        aria-label={isDark ? 'ライトモードに切り替える' : 'ダークモードに切り替える'}
        aria-pressed={isDark}
        onClick={toggleTheme}
      >
        {isDark ? (
          <Sun className={styles.icon} aria-hidden="true" strokeWidth={2.3} />
        ) : (
          <Moon className={styles.icon} aria-hidden="true" strokeWidth={2.3} />
        )}
      </button>
      <button
        className={styles.iconButton}
        type="button"
        aria-label="ヘルプを開く"
        aria-haspopup="dialog"
        onClick={() => {
          setIsHelpOpen(true);
        }}
      >
        <CircleQuestionMark className={styles.icon} aria-hidden="true" strokeWidth={2.3} />
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
