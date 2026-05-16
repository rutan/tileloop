import { ZoomIn, ZoomOut } from 'lucide-react';
import { FC, RefObject, useContext } from 'react';
import { store } from '../../store';
import styles from './PicturePreview.module.css';
import { SvgRenderer } from './SvgRenderer';
import { MAX_ZOOM, MIN_ZOOM, ZOOM_STEP, usePreviewInteractions } from './usePreviewInteractions';

interface Props {
  svgRef: RefObject<SVGSVGElement>;
}

export const PicturePreview: FC<Props> = ({ svgRef }) => {
  const { state } = useContext(store);
  const { width, height } = state.renderParameter;
  const {
    dragging,
    handlePointerCancel,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleTouchEnd,
    handleTouchMove,
    handleTouchStart,
    handleWheel,
    previewHeight,
    previewSurfaceRef,
    previewWidth,
    scrollElementRef,
    updateZoom,
    zoom,
    zoomPercent,
  } = usePreviewInteractions({ width, height });

  return (
    <div className={styles.container}>
      <div
        className={[styles.scrollArea, dragging ? styles.dragging : ''].filter(Boolean).join(' ')}
        ref={scrollElementRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onWheel={handleWheel}
      >
        <div
          className={styles.scrollContainerInner}
          style={{
            width: `${previewWidth}px`,
            height: `${previewHeight}px`,
          }}
        >
          <div
            className={styles.previewSurface}
            style={{
              width: `${previewWidth}px`,
              height: `${previewHeight}px`,
            }}
            ref={previewSurfaceRef}
          >
            <div
              className={styles.previewScale}
              style={{
                width: `${width}px`,
                height: `${height}px`,
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
          <ZoomOut className={styles.zoomIcon} aria-hidden="true" strokeWidth={2.4} />
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
          <ZoomIn className={styles.zoomIcon} aria-hidden="true" strokeWidth={2.4} />
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
