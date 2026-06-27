import { ChevronDown } from 'lucide-react';
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
      <span className={styles.selectWrapper}>
        <select className={[styles.control, styles.select].join(' ')} {...props}>
          {children}
        </select>
        <ChevronDown className={styles.selectIcon} aria-hidden="true" />
      </span>
    </label>
  );
};
