import * as React from 'react';

export interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  onChangeValue?: (value: string) => void;
}

export const InputForm: React.FC<Props> = ({ className, onChangeValue, ...props }) => {
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
