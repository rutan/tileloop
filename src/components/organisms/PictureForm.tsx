import * as React from 'react';
import styled from '@emotion/styled';
import { ClassNames, css } from '@emotion/core';
import { useRef } from 'react';
import { readFromFile } from '../../functions/readFromFile';
import { useContext } from 'react';
import { addPicture, removePicture, store, updateRenderParameterItem } from '../../store';
import { PictureItem } from '../molecules/PictureItem';
import { ReactSortable } from 'react-sortablejs';

const Container = styled.div`
  position: relative;
  min-height: 200px;
  margin: 10px;
  padding: 50px 10px 10px;
  border: 2px dotted #ccc;
  border-radius: 10px;
`;

const AddButton = styled.button`
  position: absolute;
  display: block;
  top: 10px;
  width: 180px;
  height: 40px;
  padding: 0;
  border-radius: 20px;
  line-height: 40px;
  background: #43a047;
  color: #fff;
`;

const ListStyle = css`
  display: flex;
  flex-wrap: wrap;
`;

const PictureItemWithStyle = styled(PictureItem)`
  margin: 5px;
`;

export const PictureForm = () => {
  const { state, dispatch } = useContext(store);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadFiles = async () => {
    const fileEl = fileRef.current;
    if (!fileEl) return;

    const files = fileEl.files;
    if (!files) return;

    for (let i = 0; i < files.length; ++i) {
      const data = await readFromFile(files[i]);
      dispatch(
        addPicture({
          id: Date.now(),
          url: data,
        })
      );
    }
  };

  return (
    <Container
      ref={containerRef}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDragLeave={(e) => {
        e.preventDefault();
      }}
      onDrop={(e) => {
        e.preventDefault();
        const fileEl = fileRef.current;
        if (!fileEl) return;
        fileEl.files = e.dataTransfer.files;
        loadFiles();
      }}
    >
      <input
        type="file"
        accept="image/*"
        ref={fileRef}
        style={{
          display: 'none',
        }}
        onChange={() => {
          loadFiles();
        }}
      />
      <AddButton
        onClick={() => {
          const fileEl = fileRef.current;
          if (!fileEl) return;
          fileEl.click();
        }}
      >
        画像を追加する
      </AddButton>
      <ClassNames>
        {({ css }) => (
          <ReactSortable
            className={css`
              ${ListStyle}
            `}
            list={state.renderParameter.pictures}
            setList={(pictures) => {
              dispatch(
                updateRenderParameterItem(
                  'pictures',
                  pictures.map(({ id, url }) => ({ id, url }))
                )
              );
            }}
            animation={200}
          >
            {state.renderParameter.pictures.map((picture, i) => (
              <PictureItemWithStyle
                key={picture.id}
                picture={picture}
                onRemove={() => {
                  console.log('remove!');
                  dispatch(removePicture(picture));
                }}
              />
            ))}
          </ReactSortable>
        )}
      </ClassNames>
    </Container>
  );
};
