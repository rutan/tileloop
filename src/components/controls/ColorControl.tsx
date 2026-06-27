import { FC, useEffect, useState } from 'react';
import styles from './ColorControl.module.css';

interface Props {
  title: string;
  color: string;
  opacity: number;
  onChangeColor: (color: string) => void;
  onChangeOpacity: (opacity: number) => void;
}

const colorPattern = /^#[0-9a-fA-F]{6}$/;

function clampOpacity(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export const ColorControl: FC<Props> = ({ title, color, opacity, onChangeColor, onChangeOpacity }) => {
  const [draftColor, setDraftColor] = useState(color);
  const opacityPercent = Math.round(clampOpacity(opacity) * 100);
  const colorInputLabel = title.endsWith('色') ? `${title}を選択` : `${title}の色`;

  useEffect(() => {
    setDraftColor(color);
  }, [color]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        <span className={styles.opacityValue}>{opacityPercent}%</span>
      </div>

      <div className={styles.controls}>
        <label className={styles.colorPickerLabel} aria-label={colorInputLabel}>
          <input
            className={styles.colorPicker}
            type="color"
            value={color}
            onChange={(e) => {
              setDraftColor(e.target.value);
              onChangeColor(e.target.value);
            }}
          />
        </label>

        <input
          className={styles.hexInput}
          value={draftColor}
          inputMode="text"
          spellCheck={false}
          aria-label={`${title}のカラーコード`}
          onChange={(e) => {
            const nextColor = e.target.value;
            setDraftColor(nextColor);
            if (colorPattern.test(nextColor)) {
              onChangeColor(nextColor);
            }
          }}
          onBlur={() => {
            if (!colorPattern.test(draftColor)) {
              setDraftColor(color);
            }
          }}
        />

        <input
          className={styles.opacitySlider}
          type="range"
          min={0}
          max={100}
          step={1}
          value={opacityPercent}
          aria-label={`${title}の不透明度`}
          onChange={(e) => {
            onChangeOpacity(parseInt(e.target.value, 10) / 100);
          }}
        />
      </div>
    </div>
  );
};
