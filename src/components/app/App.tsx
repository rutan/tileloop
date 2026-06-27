import { CSSProperties, useContext, useEffect, useRef, useState } from 'react';
import { exportSvgToPngBlob } from '../../functions/exportSvgToPng';
import { setResultFile, store } from '../../store';
import { EditPanel } from '../editor/EditPanel';
import { Header } from '../header/Header';
import { PicturePreview } from '../preview/PicturePreview';
import styles from './App.module.css';
import { IntroScreen } from './IntroScreen';

const introSeenStorageKey = 'tileloop:intro-seen';

function clearIntroSeenDataset() {
  if (typeof document === 'undefined') return;

  delete document.documentElement.dataset.introSeen;
}

function hasSeenIntro() {
  if (typeof window === 'undefined') return false;

  try {
    return window.sessionStorage.getItem(introSeenStorageKey) === 'true';
  } catch {
    return false;
  }
}

function saveIntroSeen() {
  if (typeof window === 'undefined') return;

  try {
    window.sessionStorage.setItem(introSeenStorageKey, 'true');
  } catch {
    // sessionStorage can be unavailable in private or restricted browser contexts.
  }
}

export const App = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [editPanelHeight, setEditPanelHeight] = useState<number | null>(null);
  const { state, dispatch } = useContext(store);
  const containerStyle =
    editPanelHeight === null ? undefined : ({ '--edit-panel-height': `${editPanelHeight}px` } as CSSProperties);

  useEffect(() => {
    const introSeen = hasSeenIntro();

    setIsStarted(introSeen);
  }, []);

  useEffect(() => {
    if (!isStarted) return;

    const frameId = requestAnimationFrame(() => {
      clearIntroSeenDataset();
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [isStarted]);

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
    <>
      <div className={styles.introScreenContainer} data-is-visible={!isStarted}>
        <IntroScreen
          onStart={() => {
            saveIntroSeen();
            setIsStarted(true);
          }}
        />
      </div>
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
    </>
  );
};
