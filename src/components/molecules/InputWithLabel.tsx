import { FC } from 'react';
import { InputForm, Props as InputFormProps } from '../atoms/InputForm';
import styles from './FormField.module.css';

interface Props extends InputFormProps {
  className?: string;
  label: string;
  type?: string;
}

export const InputWithLabel: FC<Props> = ({ className, label, ...props }) => {
  return (
    <div className={[styles.container, className].filter(Boolean).join(' ')}>
      <label className={styles.label}>{label}</label>
      <InputForm className={styles.control} {...props} />
    </div>
  );
};
