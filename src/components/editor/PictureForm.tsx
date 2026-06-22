import { FC, useCallback, useContext, useEffect, useRef } from 'react';
import { addPictures, removeAllPictures, removePicture, store } from '../../store';
import { PanelButton } from '../controls/PanelButton';
import { ActionRow } from './parts/ActionRow';
import { PictureItem } from './parts/PictureItem';
import styles from './PictureForm.module.css';

interface Props {
  isPasteEnabled?: boolean;
}

function getImageFiles(files: Iterable<File>) {
  return Array.from(files).filter((file) => file.type.startsWith('image/'));
}

function getClipboardImageFiles(data: DataTransfer) {
  const itemFiles = Array.from(data.items)
    .filter((item) => item.kind === 'file' && item.type.startsWith('image/'))
    .map((item) => item.getAsFile())
    .filter((file): file is File => file !== null);

  return itemFiles.length > 0 ? itemFiles : getImageFiles(data.files);
}

export const PictureForm: FC<Props> = ({ isPasteEnabled = true }) => {
  const { state, dispatch } = useContext(store);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadFiles = useCallback(
    (files: Iterable<File>) => {
      const imageFiles = getImageFiles(files);
      if (imageFiles.length === 0) return;

      const pictures = imageFiles.map((file) => ({
        id: crypto.randomUUID(),
        url: URL.createObjectURL(file),
      }));

      dispatch(addPictures(pictures));
    },
    [dispatch],
  );

  useEffect(() => {
    if (!isPasteEnabled) return;

    const handlePaste = (event: ClipboardEvent) => {
      const clipboardData = event.clipboardData;
      if (!clipboardData) return;

      const imageFiles = getClipboardImageFiles(clipboardData);
      if (imageFiles.length === 0) return;

      event.preventDefault();
      loadFiles(imageFiles);
    };

    document.addEventListener('paste', handlePaste);

    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [isPasteEnabled, loadFiles]);

  const loadFromFileList = (files: FileList) => {
    const imageFiles = getImageFiles(files);
    if (imageFiles.length === 0) return;

    loadFiles(imageFiles);
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
        loadFromFileList(e.dataTransfer.files);
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

          loadFromFileList(fileEl.files);
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
