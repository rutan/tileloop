import * as React from 'react';
import { useContext, useEffect, useRef, useState } from 'react';
import { store } from '../../store';
import { SvgRenderer } from '../atoms/SvgRenderer';
import styles from './PicturePreview.module.css';

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.1;
const PREVIEW_PADDING = 100;

interface Props {
  svgRef: React.RefObject<SVGSVGElement>;
}

function normalizeZoom(value: number): number {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(value * 100) / 100));
}

export const PicturePreview: React.FC<Props> = ({ svgRef }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollElementRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
  });
  const [dragging, setDragging] = useState(false);
  const [zoom, setZoom] = useState(1);
  const { state } = useContext(store);
  const previewWidth = state.renderParameter.width * zoom;
  const previewHeight = state.renderParameter.height * zoom;
  const zoomPercent = Math.round(zoom * 100);

  const updateZoom = React.useCallback(
    (value: number) => {
      const nextZoom = normalizeZoom(value);
      const element = scrollElementRef.current;

      if (!element) {
        setZoom(nextZoom);
        return;
      }

      const centerX = element.scrollLeft + element.clientWidth / 2;
      const centerY = element.scrollTop + element.clientHeight / 2;
      const imageCenterX = (centerX - PREVIEW_PADDING) / zoom;
      const imageCenterY = (centerY - PREVIEW_PADDING) / zoom;

      setZoom(nextZoom);
      requestAnimationFrame(() => {
        element.scrollTo(
          imageCenterX * nextZoom + PREVIEW_PADDING - element.clientWidth / 2,
          imageCenterY * nextZoom + PREVIEW_PADDING - element.clientHeight / 2,
        );
      });
    },
    [zoom],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const element = scrollElementRef.current;
    if (!element) return;

    const innerElement = innerRef.current;
    if (!innerElement) return;

    const containerRect = container.getBoundingClientRect();
    const innerRect = innerElement.getBoundingClientRect();

    element.scrollTo(innerRect.width / 2 - containerRect.width / 2, innerRect.height / 2 - containerRect.height / 2);
  }, [state.renderParameter.width, state.renderParameter.height]);

  return (
    <div className={styles.container} ref={containerRef}>
      <div
        className={[styles.scrollArea, dragging ? styles.dragging : ''].filter(Boolean).join(' ')}
        ref={scrollElementRef}
        onPointerDown={(e) => {
          if (e.button !== 0) return;

          const element = e.currentTarget;
          dragRef.current = {
            active: true,
            startX: e.clientX,
            startY: e.clientY,
            scrollLeft: element.scrollLeft,
            scrollTop: element.scrollTop,
          };
          element.setPointerCapture(e.pointerId);
          setDragging(true);
        }}
        onPointerMove={(e) => {
          const drag = dragRef.current;
          if (!drag.active) return;

          const element = e.currentTarget;
          element.scrollLeft = drag.scrollLeft - (e.clientX - drag.startX);
          element.scrollTop = drag.scrollTop - (e.clientY - drag.startY);
        }}
        onPointerUp={(e) => {
          if (!dragRef.current.active) return;

          dragRef.current.active = false;
          if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
          }
          setDragging(false);
        }}
        onPointerCancel={() => {
          dragRef.current.active = false;
          setDragging(false);
        }}
        onWheel={(e) => {
          if (!e.ctrlKey) return;

          e.preventDefault();
          updateZoom(zoom + (e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP));
        }}
      >
        <div
          className={styles.scrollContainerInner}
          style={{
            width: `${previewWidth}px`,
            height: `${previewHeight}px`,
          }}
          ref={innerRef}
        >
          <div
            className={styles.previewSurface}
            style={{
              width: `${previewWidth}px`,
              height: `${previewHeight}px`,
            }}
          >
            <div
              className={styles.previewScale}
              style={{
                width: `${state.renderParameter.width}px`,
                height: `${state.renderParameter.height}px`,
                transform: `scale(${zoom})`,
              }}
            >
              <SvgRenderer ref={svgRef} parameter={state.renderParameter} />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.zoomToolbar} aria-label="プレビュー倍率">
        <button
          className={styles.zoomButton}
          type="button"
          aria-label="縮小"
          disabled={zoom <= MIN_ZOOM}
          onClick={() => {
            updateZoom(zoom - ZOOM_STEP);
          }}
        >
          -
        </button>
        <input
          className={styles.zoomRange}
          type="range"
          aria-label="プレビュー倍率"
          min={MIN_ZOOM}
          max={MAX_ZOOM}
          step={0.05}
          value={zoom}
          onChange={(e) => {
            updateZoom(Number(e.target.value));
          }}
        />
        <button
          className={styles.zoomButton}
          type="button"
          aria-label="拡大"
          disabled={zoom >= MAX_ZOOM}
          onClick={() => {
            updateZoom(zoom + ZOOM_STEP);
          }}
        >
          +
        </button>
        <button
          className={styles.zoomResetButton}
          type="button"
          aria-label="プレビュー倍率を100%に戻す"
          onClick={() => {
            updateZoom(1);
          }}
        >
          {zoomPercent}%
        </button>
      </div>
    </div>
  );
};
