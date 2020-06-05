import * as React from 'react';
import styled from '@emotion/styled';
import { Picture } from '../../types/Picture';

interface Props {
  className?: string;
  picture: Picture;
  onRemove: () => void;
}

const Container = styled.div`
  background: #fff no-repeat center center;
  background-size: contain;
  border: 1px solid #333;
  width: 120px;
  height: 120px;
`;

const RemoveButton = styled.button``;

export const PictureItem: React.FC<Props> = ({ className, picture, onRemove }) => {
  return (
    <Container
      className={className}
      style={{
        backgroundImage: `url(${picture.url})`,
      }}
    >
      <RemoveButton onClick={onRemove}>×</RemoveButton>
    </Container>
  );
};
