import * as React from 'react';
import styled from '@emotion/styled';

export interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  onChangeValue?: (value: string) => void;
}

const Input = styled.input``;

export const InputForm: React.FC<Props> = ({ onChangeValue, ...props }) => {
  return (
    <Input
      {...props}
      onChange={(e) => {
        const value = e.target.value;
        if (onChangeValue) onChangeValue(value);
      }}
    />
  );
};
