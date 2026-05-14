import { ClassNames, css } from '@emotion/react';
import styled from '@emotion/styled';
import * as React from 'react';
import { useRef } from 'react';
import { useContext } from 'react';
import { ReactSortable } from 'react-sortablejs';
import { readFromFile } from '../../functions/readFromFile';
import { addPicture, removePicture, store, updateRenderParameterItem } from '../../store';
import { PictureItem } from '../molecules/PictureItem';

const Container = styled.div`
  position: relative;
  height: 100%;
  padding: 10px 10px 70px;
  border: 2px dotted #ccc;
  border-radius: 10px;
`;

const AddButton = styled.button`
  position: absolute;
  left: 10px;
  bottom: 10px;
  display: block;
  width: calc(100% - 20px);
  height: 50px;
  padding: 0;
  border-radius: 25px;
  line-height: 40px;
  background: #43a047;
  color: #fff;
`;

const ListStyle = css`
  display: flex;
  flex-wrap: wrap;
  max-height: 100%;
  overflow-y: auto;
`;

const PictureItemWithStyle = styled(PictureItem)`
  margin: 5px;
`;

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
    <Container
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
        type="file"
        accept="image/*"
        multiple
        ref={fileRef}
        style={{
          display: 'none',
        }}
        onChange={() => {
          const fileEl = fileRef.current;
          if (!fileEl?.files) return;

          void loadFiles(fileEl.files);
          fileEl.value = '';
        }}
      />
      <ClassNames>
        {(styles) => (
          <ReactSortable
            className={styles.css`
              ${ListStyle}
            `}
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
              <PictureItemWithStyle
                key={picture.id}
                picture={picture}
                onRemove={() => {
                  dispatch(removePicture(picture));
                }}
              />
            ))}
          </ReactSortable>
        )}
      </ClassNames>
      <AddButton
        onClick={() => {
          const fileEl = fileRef.current;
          if (!fileEl) return;
          fileEl.click();
        }}
      >
        画像を追加する
      </AddButton>
    </Container>
  );
};
