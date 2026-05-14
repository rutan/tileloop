import styled from '@emotion/styled';
import * as React from 'react';
import { useState } from 'react';
import { InputForm, Props as InputFormProps } from '../atoms/InputForm';

interface Props extends InputFormProps {
  className?: string;
  label: string;
  type?: string;
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
  width: 100%;
  text-align: center;
`;

export const InputWithLabel: React.FC<Props> = ({ className, label, ...props }) => {
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
      />
    </Container>
  );
};
