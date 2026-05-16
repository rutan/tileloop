import { FC, ReactNode } from 'react';
import styles from './PanelSection.module.css';

interface Props {
  children: ReactNode;
  className?: string;
  title?: string;
}

export const PanelSection: FC<Props> = ({ children, className, title }) => {
  if (!title) {
    return <div className={[styles.section, className].filter(Boolean).join(' ')}>{children}</div>;
  }

  return (
    <section className={[styles.section, className].filter(Boolean).join(' ')}>
      <h3 className={styles.title}>{title}</h3>
      {children}
    </section>
  );
};
