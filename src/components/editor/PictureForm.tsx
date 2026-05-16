import { useContext, useRef } from 'react';
import { addPictures, removeAllPictures, removePicture, store } from '../../store';
import { PanelButton } from '../controls/PanelButton';
import { ActionRow } from './parts/ActionRow';
import { PictureItem } from './parts/PictureItem';
import styles from './PictureForm.module.css';

export const PictureForm = () => {
  const { state, dispatch } = useContext(store);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadFiles = (files: FileList) => {
    const imageFiles = Array.from(files).filter((file) => file.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    const pictures = imageFiles.map((file) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
    }));

    dispatch(addPictures(pictures));
  };

  return (
    <div
      className={styles.container}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDragLeave={(e) => {
        e.preventDefault();
      }}
      onDrop={(e) => {
        e.preventDefault();
        loadFiles(e.dataTransfer.files);
      }}
    >
      <input
        className={styles.fileInput}
        type="file"
        accept="image/*"
        multiple
        ref={fileRef}
        onChange={() => {
          const fileEl = fileRef.current;
          if (!fileEl?.files) return;

          loadFiles(fileEl.files);
          fileEl.value = '';
        }}
      />
      <div className={styles.list}>
        {state.renderParameter.pictures.map((picture) => (
          <PictureItem
            className={styles.pictureItem}
            key={picture.id}
            picture={picture}
            onRemove={() => {
              dispatch(removePicture(picture));
            }}
          />
        ))}
      </div>
      <ActionRow className={styles.actions}>
        <PanelButton
          variant="danger"
          type="button"
          disabled={state.renderParameter.pictures.length === 0}
          onClick={() => {
            const confirmed = window.confirm('すべての画像を削除しますか？');
            if (!confirmed) return;
            dispatch(removeAllPictures());
          }}
        >
          すべて削除
        </PanelButton>
        <PanelButton
          variant="primary"
          type="button"
          onClick={() => {
            const fileEl = fileRef.current;
            if (!fileEl) return;
            fileEl.click();
          }}
        >
          画像を追加
        </PanelButton>
      </ActionRow>
    </div>
  );
};
