import * as React from 'react';
import { useContext } from 'react';
import { useRef } from 'react';
import { readFromFile } from '../../functions/readFromFile';
import { addPictures, removeAllPictures, removePicture, store } from '../../store';
import { PictureItem } from '../molecules/PictureItem';
import styles from './PictureForm.module.css';

export const PictureForm = () => {
  const { state, dispatch } = useContext(store);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadFiles = async (files: FileList) => {
    const imageFiles = Array.from(files).filter((file) => file.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    const pictures = await Promise.all(
      imageFiles.map(async (file) => {
        const data = await readFromFile(file);
        return {
          id: crypto.randomUUID(),
          url: data,
        };
      }),
    );

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
        void loadFiles(e.dataTransfer.files);
      }}
    >
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>画像</h2>
        </div>
        <div className={styles.actions}>
          <button
            className={styles.clearButton}
            type="button"
            disabled={state.renderParameter.pictures.length === 0}
            onClick={() => {
              const confirmed = window.confirm('すべての画像を削除しますか？');
              if (!confirmed) return;
              dispatch(removeAllPictures());
            }}
          >
            すべて削除
          </button>
          <button
            className={styles.addButton}
            type="button"
            onClick={() => {
              const fileEl = fileRef.current;
              if (!fileEl) return;
              fileEl.click();
            }}
          >
            画像を追加
          </button>
        </div>
      </div>
      <input
        className={styles.fileInput}
        type="file"
        accept="image/*"
        multiple
        ref={fileRef}
        onChange={() => {
          const fileEl = fileRef.current;
          if (!fileEl?.files) return;

          void loadFiles(fileEl.files);
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
    </div>
  );
};
