import * as React from 'react';
import { useContext, useRef } from 'react';
import { setResultFile, store } from '../store';
import styles from './App.module.css';
import { EditPanel } from './organisms/EditPanel';
import { PicturePreview } from './organisms/PicturePreview';
import { ResultModal } from './organisms/ResultModal';

export const App = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { state, dispatch } = useContext(store);

  const exportPng = () => {
    const svg = svgRef.current;
    const canvas = canvasRef.current;
    if (!svg || !canvas) return;

    const svgBlob = new Blob([new XMLSerializer().serializeToString(svg)], {
      type: 'image/svg+xml;charset=utf-8',
    });
    const svgUrl = URL.createObjectURL(svgBlob);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(svgUrl);

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Broken canvas context.');

      canvas.width = state.renderParameter.width;
      canvas.height = state.renderParameter.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (!blob) return;

          dispatch(setResultFile(URL.createObjectURL(blob)));
        },
        'image/png',
        1,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(svgUrl);
    };
    img.src = svgUrl;
  };

  return (
    <div className={styles.container}>
      <div className={styles.previewArea}>
        <PicturePreview svgRef={svgRef} />
      </div>
      <div className={styles.editArea}>
        <EditPanel onExport={exportPng} />
      </div>
      <canvas className={styles.canvas} ref={canvasRef} />
      <ResultModal />
    </div>
  );
};
