import * as React from 'react';
import { useState } from 'react';
import { InputForm, Props as InputFormProps } from '../atoms/InputForm';
import styles from './TwinInputWithLabel.module.css';

interface Props extends InputFormProps {
  className?: string;
  label: string;
  type?: string;
  value1: any;
  value2: any;
  onChangeValue1: (value: string) => void;
  onChangeValue2: (value: string) => void;
}

export const TwinInputWithLabel: React.FC<Props> = ({
  className,
  label,
  value1,
  value2,
  onChangeValue1,
  onChangeValue2,
  ...props
}) => {
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
        value={value1}
        onChangeValue={onChangeValue1}
      />
      <div className={styles.separator}>×</div>
      <InputForm
        className={styles.input}
        onFocus={() => {
          dispatchIsFocus(true);
        }}
        onBlur={() => {
          dispatchIsFocus(false);
        }}
        {...props}
        value={value2}
        onChangeValue={onChangeValue2}
      />
    </div>
  );
};
