import { useContext, useState } from 'react';
import { parseIntegerInput } from '../../functions/parseNumberInput';
import { store, updateRenderParameterItem } from '../../store';
import { TileLayoutMode } from '../../types/RenderParameter';
import { PanelButton } from '../controls/PanelButton';
import { SelectWithLabel } from '../controls/SelectWithLabel';
import { TwinInputWithLabel } from '../controls/TwinInputWithLabel';
import styles from './ParameterPanel.module.css';
import { PanelSection } from './parts/PanelSection';

const outputPresets = [
  { label: '横長SNSカバー', width: 1500, height: 500 },
  { label: 'スマホ壁紙', width: 1080, height: 1920 },
  { label: 'PC壁紙', width: 1920, height: 1080 },
  { label: 'OGP', width: 1200, height: 630 },
];

export const LayoutParameterForm = () => {
  const { state, dispatch } = useContext(store);
  const [isCustomSelected, setIsCustomSelected] = useState(false);
  const matchedPreset = outputPresets.find(
    (preset) => preset.width === state.renderParameter.width && preset.height === state.renderParameter.height,
  );
  const selectedPresetLabel = isCustomSelected ? 'custom' : (matchedPreset?.label ?? 'custom');
  const isCustomSize = selectedPresetLabel === 'custom';

  return (
    <div className={styles.container}>
      <PanelSection title="出力サイズ">
        <div className={styles.quickGrid}>
          <SelectWithLabel
            label="サイズ"
            value={selectedPresetLabel}
            onChange={(e) => {
              if (e.target.value === 'custom') {
                setIsCustomSelected(true);
                return;
              }

              const preset = outputPresets.find((item) => item.label === e.target.value);
              if (!preset) return;
              setIsCustomSelected(false);
              dispatch(updateRenderParameterItem('width', preset.width));
              dispatch(updateRenderParameterItem('height', preset.height));
            }}
          >
            {outputPresets.map((preset) => (
              <option key={preset.label} value={preset.label}>
                {preset.label}
              </option>
            ))}
            <option value="custom">カスタム</option>
          </SelectWithLabel>
        </div>

        {isCustomSize ? (
          <div className={styles.customSize}>
            <TwinInputWithLabel
              label="幅と高さ"
              type="number"
              value1={state.renderParameter.width}
              value2={state.renderParameter.height}
              min={1}
              max={4096}
              onChangeValue1={(value) => {
                dispatch(updateRenderParameterItem('width', parseIntegerInput(value)));
              }}
              onChangeValue2={(value) => {
                dispatch(updateRenderParameterItem('height', parseIntegerInput(value)));
              }}
            />
          </div>
        ) : null}
      </PanelSection>

      <PanelSection title="配置">
        <div className={styles.quickGrid}>
          <SelectWithLabel
            label="並べ方"
            value={state.renderParameter.layoutMode}
            onChange={(e) => {
              dispatch(updateRenderParameterItem('layoutMode', e.target.value as TileLayoutMode));
            }}
          >
            <option value="grid">整列グリッド</option>
            <option value="staggered">ずらしグリッド</option>
          </SelectWithLabel>

          <PanelButton
            className={styles.shuffleButton}
            type="button"
            onClick={() => {
              dispatch(updateRenderParameterItem('arrangementSeed', crypto.randomUUID()));
            }}
          >
            並びをシャッフル
          </PanelButton>
        </div>
      </PanelSection>
    </div>
  );
};
