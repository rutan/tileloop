import * as React from 'react';
import { useContext } from 'react';
import { store, updateRenderParameterItem } from '../../store';
import { InputWithLabel } from '../molecules/InputWithLabel';
import { TwinInputWithLabel } from '../molecules/TwinInputWithLabel';
import styles from './ParameterForm.module.css';

export const ParameterForm = () => {
  const { state, dispatch } = useContext(store);

  return (
    <div>
      <div className={styles.inputBlock}>
        <TwinInputWithLabel
          className={styles.twinNumberInput}
          label="出力サイズ"
          type="number"
          value1={state.renderParameter.width}
          value2={state.renderParameter.height}
          min={1}
          max={4096}
          onChangeValue1={(value) => {
            const num = parseInt(value, 10);
            dispatch(updateRenderParameterItem('width', isNaN(num) ? 0 : num));
          }}
          onChangeValue2={(value) => {
            const num = parseInt(value, 10);
            dispatch(updateRenderParameterItem('height', isNaN(num) ? 0 : num));
          }}
        />
      </div>

      <div className={styles.inputBlock}>
        <TwinInputWithLabel
          className={styles.twinNumberInput}
          label="並べる画像: サイズ"
          type="number"
          value1={state.renderParameter.itemWidth}
          value2={state.renderParameter.itemHeight}
          min={1}
          max={1024}
          onChangeValue1={(value) => {
            const num = parseInt(value, 10);
            dispatch(updateRenderParameterItem('itemWidth', isNaN(num) ? 0 : num));
          }}
          onChangeValue2={(value) => {
            const num = parseInt(value, 10);
            dispatch(updateRenderParameterItem('itemHeight', isNaN(num) ? 0 : num));
          }}
        />

        <TwinInputWithLabel
          className={styles.twinNumberInput}
          label="並べる画像: 個数"
          type="number"
          value1={state.renderParameter.itemSizeX}
          value2={state.renderParameter.itemSizeY}
          min={1}
          max={50}
          onChangeValue1={(value) => {
            const num = parseInt(value, 10);
            dispatch(updateRenderParameterItem('itemSizeX', isNaN(num) ? 0 : num));
          }}
          onChangeValue2={(value) => {
            const num = parseInt(value, 10);
            dispatch(updateRenderParameterItem('itemSizeY', isNaN(num) ? 0 : num));
          }}
        />
      </div>

      <div className={styles.inputBlock}>
        <InputWithLabel
          className={styles.numberInput}
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

        <InputWithLabel
          className={styles.numberInput}
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

        <InputWithLabel
          className={styles.numberInput}
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
      </div>

      <div className={styles.inputBlock}>
        <InputWithLabel
          className={styles.numberInput}
          label="背景: 色"
          type="color"
          value={state.renderParameter.bgColor}
          onChangeValue={(value) => {
            dispatch(updateRenderParameterItem('bgColor', value));
          }}
        />

        <InputWithLabel
          className={styles.numberInput}
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
      </div>

      <div className={styles.inputBlock}>
        <InputWithLabel
          className={styles.numberInput}
          label="カバー: 色"
          type="color"
          value={state.renderParameter.frontColor}
          onChangeValue={(value) => {
            dispatch(updateRenderParameterItem('frontColor', value));
          }}
        />

        <InputWithLabel
          className={styles.numberInput}
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
      </div>
    </div>
  );
};
