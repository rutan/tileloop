import { FC } from 'react';
import styles from './OpacityControl.module.css';

interface Props {
  title: string;
  opacity: number;
  onChangeOpacity: (opacity: number) => void;
}

function clampOpacity(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export const OpacityControl: FC<Props> = ({ title, opacity, onChangeOpacity }) => {
  const opacityPercent = Math.round(clampOpacity(opacity) * 100);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        <span className={styles.opacityValue}>{opacityPercent}%</span>
      </div>

      <input
        className={styles.opacitySlider}
        type="range"
        min={0}
        max={100}
        step={1}
        value={opacityPercent}
        aria-label={`${title}の透明度`}
        onChange={(e) => {
          onChangeOpacity(parseInt(e.target.value, 10) / 100);
        }}
      />
    </div>
  );
};
