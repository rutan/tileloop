import * as React from 'react';
import styled from '@emotion/styled';
import { InputWithLabel } from '../molecules/InputWithLabel';
import { useContext } from 'react';
import { store, updateRenderParameterItem } from '../../store';

const Container = styled.div``;

const InputBlock = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const NumberInput = styled(InputWithLabel)`
  width: 140px;
`;

export const ParameterForm = () => {
  const { state, dispatch } = useContext(store);

  return (
    <Container>
      <InputBlock>
        <NumberInput
          label="出力画像の幅"
          type="number"
          value={state.renderParameter.width}
          min={1}
          max={4096}
          onChangeValue={(value) => {
            const num = parseInt(value, 10);
            dispatch(updateRenderParameterItem('width', isNaN(num) ? 0 : num));
          }}
        />
        <NumberInput
          label="出力画像の高さ"
          type="number"
          value={state.renderParameter.height}
          min={1}
          max={4096}
          onChangeValue={(value) => {
            const num = parseInt(value, 10);
            dispatch(updateRenderParameterItem('height', isNaN(num) ? 0 : num));
          }}
        />
      </InputBlock>

      <InputBlock>
        <NumberInput
          label="並べる画像の幅"
          type="number"
          value={state.renderParameter.itemWidth}
          min={1}
          max={1024}
          onChangeValue={(value) => {
            const num = parseInt(value, 10);
            dispatch(updateRenderParameterItem('itemWidth', isNaN(num) ? 0 : num));
          }}
        />
        <NumberInput
          label="並べる画像の高さ"
          type="number"
          value={state.renderParameter.itemHeight}
          min={1}
          max={1024}
          onChangeValue={(value) => {
            const num = parseInt(value, 10);
            dispatch(updateRenderParameterItem('itemHeight', isNaN(num) ? 0 : num));
          }}
        />

        <NumberInput
          label="並べる画像数: 横"
          type="number"
          value={state.renderParameter.itemSizeX}
          min={1}
          max={50}
          onChangeValue={(value) => {
            const num = parseInt(value, 10);
            dispatch(updateRenderParameterItem('itemSizeX', isNaN(num) ? 0 : num));
          }}
        />

        <NumberInput
          label="並べる画像数: 縦"
          type="number"
          value={state.renderParameter.itemSizeY}
          min={1}
          max={50}
          onChangeValue={(value) => {
            const num = parseInt(value, 10);
            dispatch(updateRenderParameterItem('itemSizeY', isNaN(num) ? 0 : num));
          }}
        />
      </InputBlock>

      <InputBlock>
        <NumberInput
          label="画像の傾き"
          type="number"
          value={state.renderParameter.rotation}
          min={-360}
          max={360}
          step={0.1}
          onChangeValue={(value) => {
            const num = parseFloat(value);
            dispatch(updateRenderParameterItem('rotation', isNaN(num) ? 0 : num));
          }}
        />

        <NumberInput
          label="画像同士の隙間"
          type="number"
          value={state.renderParameter.margin}
          min={0}
          max={1000}
          onChangeValue={(value) => {
            const num = parseInt(value, 10);
            dispatch(updateRenderParameterItem('margin', isNaN(num) ? 0 : num));
          }}
        />

        <NumberInput
          label="画像の角丸サイズ"
          type="number"
          value={state.renderParameter.borderRadius}
          min={0}
          max={512}
          onChangeValue={(value) => {
            const num = parseInt(value, 10);
            dispatch(updateRenderParameterItem('borderRadius', isNaN(num) ? 0 : num));
          }}
        />
      </InputBlock>

      <InputBlock>
        <NumberInput
          label="背景: 色"
          type="color"
          value={state.renderParameter.bgColor}
          onChangeValue={(value) => {
            dispatch(updateRenderParameterItem('bgColor', value));
          }}
        />

        <NumberInput
          label="背景: 透明度"
          type="number"
          min={0}
          max={1}
          step={0.01}
          value={state.renderParameter.bgOpacity}
          onChangeValue={(value) => {
            const num = parseFloat(value);
            dispatch(updateRenderParameterItem('bgOpacity', isNaN(num) ? 0 : num));
          }}
        />

        <NumberInput
          label="カバー: 色"
          type="color"
          value={state.renderParameter.frontColor}
          onChangeValue={(value) => {
            dispatch(updateRenderParameterItem('frontColor', value));
          }}
        />

        <NumberInput
          label="カバー: 透明度"
          type="number"
          min={0}
          max={1}
          step="0.01"
          value={state.renderParameter.frontOpacity}
          onChangeValue={(value) => {
            const num = parseFloat(value);
            dispatch(updateRenderParameterItem('frontOpacity', isNaN(num) ? 0 : num));
          }}
        />
      </InputBlock>
    </Container>
  );
};
