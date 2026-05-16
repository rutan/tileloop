import { FC, SelectHTMLAttributes } from 'react';
import styles from './FormField.module.css';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
  label: string;
}

export const SelectWithLabel: FC<Props> = ({ className, label, children, ...props }) => {
  return (
    <label className={[styles.container, className].filter(Boolean).join(' ')}>
      <span className={styles.label}>{label}</span>
      <select className={styles.control} {...props}>
        {children}
      </select>
    </label>
  );
};
