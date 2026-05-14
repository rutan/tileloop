import * as React from 'react';
import { useContext } from 'react';
import { store, updateRenderParameterItem } from '../../store';
import { TileLayoutMode } from '../../types/RenderParameter';
import { ColorControl } from '../molecules/ColorControl';
import { InputWithLabel } from '../molecules/InputWithLabel';
import { TwinInputWithLabel } from '../molecules/TwinInputWithLabel';
import styles from './ParameterForm.module.css';

const outputPresets = [
  { label: 'OGP / カバー', width: 1200, height: 630 },
  { label: '正方形', width: 1080, height: 1080 },
  { label: '横長ヘッダー', width: 1500, height: 500 },
  { label: '縦長', width: 1080, height: 1920 },
];

export const ParameterForm = () => {
  const { state, dispatch } = useContext(store);
  const selectedPreset =
    outputPresets.find(
      (preset) => preset.width === state.renderParameter.width && preset.height === state.renderParameter.height,
    )?.label ?? 'カスタム';

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>かんたん設定</h3>
        <div className={styles.quickGrid}>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>用途</span>
            <select
              className={styles.select}
              value={selectedPreset}
              onChange={(e) => {
                const preset = outputPresets.find((item) => item.label === e.target.value);
                if (!preset) return;
                dispatch(updateRenderParameterItem('width', preset.width));
                dispatch(updateRenderParameterItem('height', preset.height));
              }}
            >
              {outputPresets.map((preset) => (
                <option key={preset.label} value={preset.label}>
                  {preset.label}
                </option>
              ))}
              {selectedPreset === 'カスタム' && (
                <option value="カスタム" disabled>
                  カスタム
                </option>
              )}
            </select>
          </label>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>配置</span>
            <select
              className={styles.select}
              value={state.renderParameter.layoutMode}
              onChange={(e) => {
                dispatch(updateRenderParameterItem('layoutMode', e.target.value as TileLayoutMode));
              }}
            >
              <option value="grid">グリッド</option>
              <option value="staggered">ずらしグリッド</option>
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
      </section>

      <details className={styles.advanced}>
        <summary className={styles.advancedSummary}>詳細設定</summary>
        <div className={styles.advancedBody}>
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
            <ColorControl
              title="背景"
              color={state.renderParameter.bgColor}
              opacity={state.renderParameter.bgOpacity}
              onChangeColor={(value) => {
                dispatch(updateRenderParameterItem('bgColor', value));
              }}
              onChangeOpacity={(value) => {
                dispatch(updateRenderParameterItem('bgOpacity', value));
              }}
            />
            <ColorControl
              title="カバー"
              color={state.renderParameter.frontColor}
              opacity={state.renderParameter.frontOpacity}
              onChangeColor={(value) => {
                dispatch(updateRenderParameterItem('frontColor', value));
              }}
              onChangeOpacity={(value) => {
                dispatch(updateRenderParameterItem('frontOpacity', value));
              }}
            />
          </section>
        </div>
      </details>
    </div>
  );
};
