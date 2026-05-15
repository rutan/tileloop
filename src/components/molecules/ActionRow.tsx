import { FC, ReactNode } from 'react';
import styles from './ActionRow.module.css';

interface Props {
  children: ReactNode;
  className?: string;
}

export const ActionRow: FC<Props> = ({ children, className }) => {
  return <div className={[styles.row, className].filter(Boolean).join(' ')}>{children}</div>;
};
