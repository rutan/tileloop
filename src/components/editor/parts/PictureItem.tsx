import { X } from 'lucide-react';
import { FC } from 'react';
import { Picture } from '../../../types/Picture';
import styles from './PictureItem.module.css';

interface Props {
  className?: string;
  picture: Picture;
  onRemove: () => void;
}

export const PictureItem: FC<Props> = ({ className, picture, onRemove }) => {
  return (
    <div className={[styles.container, className].filter(Boolean).join(' ')}>
      <div
        className={styles.thumbnail}
        style={{
          backgroundImage: `url(${picture.url})`,
        }}
      />
      <button className={styles.removeButton} type="button" aria-label="画像を削除" onClick={onRemove}>
        <X className={styles.removeIcon} aria-hidden="true" strokeWidth={2.6} />
      </button>
    </div>
  );
};
