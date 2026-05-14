import * as React from 'react';
import { useState } from 'react';
import { InputForm, Props as InputFormProps } from '../atoms/InputForm';
import styles from './InputWithLabel.module.css';

interface Props extends InputFormProps {
  className?: string;
  label: string;
  type?: string;
}

export const InputWithLabel: React.FC<Props> = ({ className, label, ...props }) => {
  const [isFocus, dispatchIsFocus] = useState(false);

  return (
    <div className={[styles.container, isFocus ? styles.focus : '', className].filter(Boolean).join(' ')}>
      <label className={styles.label}>{label}</label>
      <InputForm
        className={styles.input}
        onFocus={() => {
          dispatchIsFocus(true);
        }}
        onBlur={() => {
          dispatchIsFocus(false);
        }}
        {...props}
      />
    </div>
  );
};
