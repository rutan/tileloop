import { CSSProperties, useContext, useRef, useState } from 'react';
import { exportSvgToPngBlob } from '../../functions/exportSvgToPng';
import { setResultFile, store } from '../../store';
import { EditPanel } from '../editor/EditPanel';
import { Header } from '../header/Header';
import { PicturePreview } from '../preview/PicturePreview';
import styles from './App.module.css';

export const App = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [editPanelHeight, setEditPanelHeight] = useState<number | null>(null);
  const { state, dispatch } = useContext(store);
  const containerStyle =
    editPanelHeight === null ? undefined : ({ '--edit-panel-height': `${editPanelHeight}px` } as CSSProperties);

  const exportPng = async () => {
    const svg = svgRef.current;
    const canvas = canvasRef.current;
    if (!svg || !canvas || isExporting) return;

    const { width, height } = state.renderParameter;
    setIsExporting(true);

    try {
      const blob = await exportSvgToPngBlob(svg, canvas, width, height);
      dispatch(setResultFile(URL.createObjectURL(blob)));
    } catch (error) {
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={styles.container} style={containerStyle}>
      <div className={styles.headerArea}>
        <Header />
      </div>
      <div className={styles.previewArea}>
        <PicturePreview svgRef={svgRef} />
      </div>
      <div className={styles.editArea}>
        <EditPanel isExporting={isExporting} onExport={exportPng} onSheetHeightChange={setEditPanelHeight} />
      </div>
      <canvas className={styles.canvas} ref={canvasRef} />
    </div>
  );
};
