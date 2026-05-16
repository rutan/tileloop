import { FC, InputHTMLAttributes } from 'react';

export interface Props extends InputHTMLAttributes<HTMLInputElement> {
  onChangeValue?: (value: string) => void;
}

export const InputForm: FC<Props> = ({ className, onChangeValue, ...props }) => {
  return (
    <input
      {...props}
      className={className}
      onChange={(e) => {
        const value = e.target.value;
        if (onChangeValue) onChangeValue(value);
      }}
    />
  );
};
