import * as React from 'react';
import styled from '@emotion/styled';
import { InputForm, Props as InputFormProps } from '../atoms/InputForm';
import { useState } from 'react';

interface Props extends InputFormProps {
  className?: string;
  label: string;
  type?: string;
  value1: any;
  value2: any;
  onChangeValue1: (value: string) => void;
  onChangeValue2: (value: string) => void;
}

const Container = styled.div<{ isFocus: boolean }>`
  position: relative;
  border: 1px solid;
  border-top-width: 0;
  border-color: ${({ isFocus }: { isFocus: boolean }) => (isFocus ? '#43A047' : '#81C784')};
  background: ${({ isFocus }: { isFocus: boolean }) => (isFocus ? '#C8E6C9' : 'transparent')};
  margin: 10px;
  padding: 20px 10px 10px 10px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  transition: all 0.2s ease-in-out;
`;

const Label = styled.label<{ isFocus: boolean }>`
  position: absolute;
  top: calc(-5px);
  left: 0;
  display: block;
  width: 100%;
  text-align: center;
  font-size: 13px;
  color: ${({ isFocus }: { isFocus: boolean }) => (isFocus ? '#43A047' : '#333')};
`;

const InputFormWithStyle = styled(InputForm)`
  display: block;
  width: calc((100% - 30px) / 2);
  text-align: center;
`;

const Text = styled.div`
  display: block;
  width: 30px;
  text-align: center;
  font-size: 14px;
`;

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
    <Container className={className} isFocus={isFocus}>
      <Label isFocus={isFocus}>{label}</Label>
      <InputFormWithStyle
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
      <Text>×</Text>
      <InputFormWithStyle
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
    </Container>
  );
};
