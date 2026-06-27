import { useContext } from 'react';
import { parseDecimalInput, parseIntegerInput } from '../../functions/parseNumberInput';
import { store, updateRenderParameterItem } from '../../store';
import { ColorControl } from '../controls/ColorControl';
import { InputWithLabel } from '../controls/InputWithLabel';
import { OpacityControl } from '../controls/OpacityControl';
import { TwinInputWithLabel } from '../controls/TwinInputWithLabel';
import styles from './ParameterPanel.module.css';
import { PanelSection } from './parts/PanelSection';

export const AdjustmentParameterForm = () => {
  const { state, dispatch } = useContext(store);

  return (
    <div className={styles.container}>
      <PanelSection title="背景">
        <ColorControl
          title="背景色"
          color={state.renderParameter.bgColor}
          opacity={state.renderParameter.bgOpacity}
          onChangeColor={(value) => {
            dispatch(updateRenderParameterItem('bgColor', value));
          }}
          onChangeOpacity={(value) => {
            dispatch(updateRenderParameterItem('bgOpacity', value));
          }}
        />
      </PanelSection>

      <PanelSection title="タイル">
        <div className={styles.grid}>
          <TwinInputWithLabel
            label="画像サイズ"
            type="number"
            value1={state.renderParameter.itemWidth}
            value2={state.renderParameter.itemHeight}
            min={1}
            max={1024}
            onChangeValue1={(value) => {
              dispatch(updateRenderParameterItem('itemWidth', parseIntegerInput(value)));
            }}
            onChangeValue2={(value) => {
              dispatch(updateRenderParameterItem('itemHeight', parseIntegerInput(value)));
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
              dispatch(updateRenderParameterItem('rotation', parseDecimalInput(value)));
            }}
          />

          <InputWithLabel
            label="タイル間の余白"
            type="number"
            value={state.renderParameter.margin}
            min={-1000}
            max={1000}
            onChangeValue={(value) => {
              dispatch(updateRenderParameterItem('margin', parseIntegerInput(value)));
            }}
          />

          <InputWithLabel
            label="角丸"
            type="number"
            value={state.renderParameter.borderRadius}
            min={0}
            max={512}
            onChangeValue={(value) => {
              dispatch(updateRenderParameterItem('borderRadius', parseIntegerInput(value)));
            }}
          />

          <OpacityControl
            title="透明度"
            opacity={state.renderParameter.tileOpacity}
            onChangeOpacity={(value) => {
              dispatch(updateRenderParameterItem('tileOpacity', value));
            }}
          />
        </div>
      </PanelSection>

      <PanelSection title="タイルの影">
        <ColorControl
          title="影の色"
          color={state.renderParameter.shadowColor}
          opacity={state.renderParameter.shadowOpacity}
          onChangeColor={(value) => {
            dispatch(updateRenderParameterItem('shadowColor', value));
          }}
          onChangeOpacity={(value) => {
            dispatch(updateRenderParameterItem('shadowOpacity', value));
          }}
        />
        <div className={styles.grid}>
          <InputWithLabel
            label="ぼかし"
            type="number"
            value={state.renderParameter.shadowBlur}
            min={0}
            max={128}
            step={0.1}
            onChangeValue={(value) => {
              dispatch(updateRenderParameterItem('shadowBlur', parseDecimalInput(value)));
            }}
          />

          <TwinInputWithLabel
            label="位置"
            type="number"
            value1={state.renderParameter.shadowOffsetX}
            value2={state.renderParameter.shadowOffsetY}
            min={-512}
            max={512}
            step={0.1}
            onChangeValue1={(value) => {
              dispatch(updateRenderParameterItem('shadowOffsetX', parseDecimalInput(value)));
            }}
            onChangeValue2={(value) => {
              dispatch(updateRenderParameterItem('shadowOffsetY', parseDecimalInput(value)));
            }}
          />
        </div>
      </PanelSection>
    </div>
  );
};
