import { Download, GripHorizontal, ImagePlus, LayoutGrid, SlidersHorizontal, type LucideIcon } from 'lucide-react';
import { CSSProperties, FC, PointerEvent as ReactPointerEvent, ReactNode, useEffect, useRef, useState } from 'react';
import { AdjustmentParameterForm } from './AdjustmentParameterForm';
import styles from './EditPanel.module.css';
import { LayoutParameterForm } from './LayoutParameterForm';
import { PictureForm } from './PictureForm';
import { SavePanel } from './SavePanel';

type PanelKey = 'pictures' | 'layout' | 'adjust' | 'export';

interface Props {
  isExporting: boolean;
  onExport: () => Promise<void>;
  onSheetHeightChange?: (height: number) => void;
}

const navItems: { key: PanelKey; title: string; buttonLabel: string; Icon: LucideIcon }[] = [
  { key: 'pictures', title: '並べる画像を選択', buttonLabel: '画像', Icon: ImagePlus },
  { key: 'layout', title: '画像の配置を設定', buttonLabel: '配置', Icon: LayoutGrid },
  { key: 'adjust', title: '細かい見た目を調整', buttonLabel: '調整', Icon: SlidersHorizontal },
  { key: 'export', title: '作成した画像を保存', buttonLabel: '保存', Icon: Download },
];

type SheetPosition = 'collapsed' | 'open';

interface DragState {
  pointerId: number;
  startY: number;
  startHeight: number;
  currentHeight: number;
  lastY: number;
  lastTime: number;
  velocityY: number;
  hasMoved: boolean;
}

const collapsedSheetHeight = 96;
const minOpenSheetHeight = 260;
const maxOpenSheetHeight = 800;
const openSheetViewportRatio = 0.8;
const snapVelocityThreshold = 0.35;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getViewportHeight() {
  return window.visualViewport?.height ?? window.innerHeight;
}

function getOpenSheetHeight() {
  const viewportHeight = getViewportHeight();
  const fittedHeight = clamp(viewportHeight * openSheetViewportRatio, minOpenSheetHeight, maxOpenSheetHeight);

  return Math.max(collapsedSheetHeight, Math.min(fittedHeight, viewportHeight - 20));
}

export const EditPanel: FC<Props> = ({ isExporting, onExport, onSheetHeightChange }) => {
  const [activePanel, setActivePanel] = useState<PanelKey>('pictures');
  const [sheetPosition, setSheetPosition] = useState<SheetPosition>('open');
  const [openSheetHeight, setOpenSheetHeight] = useState(() =>
    typeof window === 'undefined' ? maxOpenSheetHeight : getOpenSheetHeight(),
  );
  const [dragHeight, setDragHeight] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<DragState | null>(null);
  const suppressClickRef = useRef(false);
  const collapsedHeight = Math.min(collapsedSheetHeight, openSheetHeight);
  const sheetHeight = dragHeight ?? (sheetPosition === 'open' ? openSheetHeight : collapsedHeight);
  const sheetProgress =
    openSheetHeight === collapsedHeight
      ? 1
      : clamp((sheetHeight - collapsedHeight) / (openSheetHeight - collapsedHeight), 0, 1);

  useEffect(() => {
    const updateOpenSheetHeight = () => {
      setOpenSheetHeight(getOpenSheetHeight());
    };

    updateOpenSheetHeight();
    window.addEventListener('resize', updateOpenSheetHeight);
    window.visualViewport?.addEventListener('resize', updateOpenSheetHeight);

    return () => {
      window.removeEventListener('resize', updateOpenSheetHeight);
      window.visualViewport?.removeEventListener('resize', updateOpenSheetHeight);
    };
  }, []);

  useEffect(() => {
    onSheetHeightChange?.(sheetHeight);
  }, [onSheetHeightChange, sheetHeight]);

  const finishDrag = (shouldSnap: boolean) => {
    const drag = dragRef.current;
    if (!drag) return;

    if (shouldSnap) {
      const midpoint = collapsedHeight + (openSheetHeight - collapsedHeight) / 2;
      const nextPosition =
        drag.velocityY < -snapVelocityThreshold
          ? 'open'
          : drag.velocityY > snapVelocityThreshold
            ? 'collapsed'
            : drag.currentHeight >= midpoint
              ? 'open'
              : 'collapsed';

      setSheetPosition(nextPosition);
    }

    suppressClickRef.current = drag.hasMoved;
    dragRef.current = null;
    setDragHeight(null);
    setIsDragging(false);
  };

  const handleSheetPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    const now = event.timeStamp;
    dragRef.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      startHeight: sheetHeight,
      currentHeight: sheetHeight,
      lastY: event.clientY,
      lastTime: now,
      velocityY: 0,
      hasMoved: false,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
    setDragHeight(sheetHeight);
    setIsDragging(true);
  };

  const handleSheetPointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const deltaY = event.clientY - drag.startY;
    const nextHeight = clamp(drag.startHeight - deltaY, collapsedHeight, openSheetHeight);
    const elapsedTime = event.timeStamp - drag.lastTime;

    if (Math.abs(deltaY) > 3) {
      drag.hasMoved = true;
    }
    if (elapsedTime > 0) {
      drag.velocityY = (event.clientY - drag.lastY) / elapsedTime;
    }

    drag.currentHeight = nextHeight;
    drag.lastY = event.clientY;
    drag.lastTime = event.timeStamp;
    setDragHeight(nextHeight);
  };

  const handleSheetPointerUp = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    finishDrag(drag.hasMoved);
  };

  const handleSheetPointerCancel = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    finishDrag(true);
  };

  const sheetStyle = {
    '--sheet-height': `${sheetHeight}px`,
    '--sheet-progress': `${sheetProgress}`,
  } as CSSProperties;
  const panelContent: Record<PanelKey, ReactNode> = {
    pictures: <PictureForm isPasteEnabled={activePanel === 'pictures'} />,
    layout: <LayoutParameterForm />,
    adjust: <AdjustmentParameterForm />,
    export: <SavePanel isExporting={isExporting} onExport={onExport} />,
  };

  return (
    <div
      className={[
        styles.container,
        sheetPosition === 'open' && !isDragging ? styles.open : '',
        sheetPosition === 'collapsed' && !isDragging ? styles.collapsed : '',
        isDragging ? styles.dragging : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={sheetStyle}
    >
      <button
        className={styles.sheetToggle}
        type="button"
        aria-expanded={sheetPosition === 'open'}
        aria-label={sheetPosition === 'collapsed' ? '編集パネルを開く' : '編集パネルを閉じる'}
        onPointerDown={handleSheetPointerDown}
        onPointerMove={handleSheetPointerMove}
        onPointerUp={handleSheetPointerUp}
        onPointerCancel={handleSheetPointerCancel}
        onClick={() => {
          if (suppressClickRef.current) {
            suppressClickRef.current = false;
            return;
          }

          setSheetPosition(sheetPosition === 'open' ? 'collapsed' : 'open');
        }}
      >
        <GripHorizontal className={styles.sheetToggleIcon} aria-hidden="true" strokeWidth={2.6} />
      </button>

      <div className={styles.body}>
        {navItems.map((item) => (
          <section
            className={[styles.panel, activePanel === item.key ? styles.activePanel : ''].filter(Boolean).join(' ')}
            key={item.key}
          >
            <h2 className={styles.sectionTitle}>{item.title}</h2>
            {panelContent[item.key]}
          </section>
        ))}
      </div>

      <nav className={styles.nav} aria-label="編集メニュー">
        {navItems.map((item) => {
          const Icon = item.Icon;

          return (
            <button
              className={[styles.navButton, activePanel === item.key ? styles.activeNavButton : '']
                .filter(Boolean)
                .join(' ')}
              key={item.key}
              type="button"
              aria-current={activePanel === item.key ? 'page' : undefined}
              onPointerDown={(event) => {
                if (event.pointerType === 'mouse' && event.button !== 0) return;

                if (sheetPosition === 'collapsed') {
                  setActivePanel(item.key);
                  setSheetPosition('open');
                }
              }}
              onClick={() => {
                setActivePanel(item.key);
                setSheetPosition('open');
              }}
            >
              <Icon className={styles.navIcon} aria-hidden="true" strokeWidth={2.4} />
              <span className={styles.navLabel}>{item.buttonLabel}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
