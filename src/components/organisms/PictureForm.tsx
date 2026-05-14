import * as React from 'react';
import { useContext } from 'react';
import { useRef } from 'react';
import { ReactSortable } from 'react-sortablejs';
import { readFromFile } from '../../functions/readFromFile';
import { addPicture, removePicture, store, updateRenderParameterItem } from '../../store';
import { PictureItem } from '../molecules/PictureItem';
import styles from './PictureForm.module.css';

export const PictureForm = () => {
  const { state, dispatch } = useContext(store);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadFiles = async (files: FileList) => {
    for (let i = 0; i < files.length; ++i) {
      const data = await readFromFile(files[i]);
      dispatch(
        addPicture({
          id: crypto.randomUUID(),
          url: data,
        }),
      );
    }
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
      <ReactSortable
        className={styles.list}
        list={state.renderParameter.pictures}
        setList={(pictures) => {
          dispatch(
            updateRenderParameterItem(
              'pictures',
              pictures.map(({ id, url }) => ({ id, url })),
            ),
          );
        }}
        animation={200}
      >
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
      </ReactSortable>
      <button
        className={styles.addButton}
        type="button"
        onClick={() => {
          const fileEl = fileRef.current;
          if (!fileEl) return;
          fileEl.click();
        }}
      >
        画像を追加する
      </button>
    </div>
  );
};
