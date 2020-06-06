import * as React from 'react';
import styled from '@emotion/styled';
import { MdClose } from 'react-icons/md';
import { Picture } from '../../types/Picture';

interface Props {
  className?: string;
  picture: Picture;
  onRemove: () => void;
}

const Container = styled.div`
  position: relative;
  background: #f1f1f1 no-repeat center center;
  background-size: contain;
  border: 1px solid #eee;
  width: 120px;
  height: 120px;
  border-radius: 2px;
`;

const RemoveButton = styled.button`
  position: absolute;
  right: 2px;
  top: 2px;
  width: 32px;
  height: 32px;
  background: #fff;
  border-radius: 100%;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: #f33;
    color: #fff;
  }
`;

export const PictureItem: React.FC<Props> = ({ className, picture, onRemove }) => {
  return (
    <Container
      className={className}
      style={{
        backgroundImage: `url(${picture.url})`,
      }}
    >
      <RemoveButton onClick={onRemove}>
        <MdClose />
      </RemoveButton>
    </Container>
  );
};
