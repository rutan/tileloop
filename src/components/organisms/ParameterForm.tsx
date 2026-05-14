import * as React from 'react';
import { useContext } from 'react';
import { store, updateRenderParameterItem } from '../../store';
import { TileArrangementMode } from '../../types/RenderParameter';
import { InputWithLabel } from '../molecules/InputWithLabel';
import { TwinInputWithLabel } from '../molecules/TwinInputWithLabel';
import styles from './ParameterForm.module.css';

export const ParameterForm = () => {
  const { state, dispatch } = useContext(store);

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>出力</h3>
        <TwinInputWithLabel
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
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>タイル</h3>
        <div className={styles.arrangementRow}>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>並べ方</span>
            <select
              className={styles.select}
              value={state.renderParameter.arrangementMode}
              onChange={(e) => {
                dispatch(updateRenderParameterItem('arrangementMode', e.target.value as TileArrangementMode));
              }}
            >
              <option value="balanced">バランスよく</option>
              <option value="random">ランダム</option>
            </select>
          </label>
          <button
            className={styles.shuffleButton}
            type="button"
            onClick={() => {
              dispatch(updateRenderParameterItem('arrangementSeed', crypto.randomUUID()));
            }}
          >
            並びをシャッフル
          </button>
        </div>
        <div className={styles.grid}>
          <TwinInputWithLabel
            label="画像サイズ"
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
            label="並べる個数"
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
        <div className={styles.grid}>
          <InputWithLabel
            label="回転"
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
            label="余白"
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
            label="角丸"
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
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>色</h3>
        <div className={styles.grid}>
          <InputWithLabel
            label="背景色"
            type="color"
            value={state.renderParameter.bgColor}
            onChangeValue={(value) => {
              dispatch(updateRenderParameterItem('bgColor', value));
            }}
          />

          <InputWithLabel
            label="背景透明度"
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
        <div className={styles.grid}>
          <InputWithLabel
            label="カバー色"
            type="color"
            value={state.renderParameter.frontColor}
            onChangeValue={(value) => {
              dispatch(updateRenderParameterItem('frontColor', value));
            }}
          />

          <InputWithLabel
            label="カバー透明度"
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
      </section>
    </div>
  );
};
