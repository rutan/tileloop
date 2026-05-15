import { X } from 'lucide-react';
import { FC } from 'react';
import { InputForm, Props as InputFormProps } from '../atoms/InputForm';
import styles from './FormField.module.css';

interface Props extends InputFormProps {
  className?: string;
  label: string;
  type?: string;
  value1: any;
  value2: any;
  onChangeValue1: (value: string) => void;
  onChangeValue2: (value: string) => void;
}

export const TwinInputWithLabel: FC<Props> = ({
  className,
  label,
  value1,
  value2,
  onChangeValue1,
  onChangeValue2,
  ...props
}) => {
  return (
    <div className={[styles.container, className].filter(Boolean).join(' ')}>
      <label className={styles.label}>{label}</label>
      <div className={styles.twinInputs}>
        <InputForm className={styles.control} {...props} value={value1} onChangeValue={onChangeValue1} />
        <div className={styles.separator} aria-hidden="true">
          <X className={styles.separatorIcon} strokeWidth={2.2} />
        </div>
        <InputForm className={styles.control} {...props} value={value2} onChangeValue={onChangeValue2} />
      </div>
    </div>
  );
};
