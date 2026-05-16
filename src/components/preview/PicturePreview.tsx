import { ZoomIn, ZoomOut } from 'lucide-react';
import {
  FC,
  RefObject,
  TouchEvent as ReactTouchEvent,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { store } from '../../store';
import styles from './PicturePreview.module.css';
import { SvgRenderer } from './SvgRenderer';

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.1;

interface Props {
  svgRef: RefObject<SVGSVGElement>;
}

interface Touches {
  item(index: number): { clientX: number; clientY: number } | null;
}

function normalizeZoom(value: number): number {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(value * 100) / 100));
}

function getScrollOffset(container: HTMLElement, element: HTMLElement) {
  const containerRect = container.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();

  return {
    left: elementRect.left - containerRect.left + container.scrollLeft,
    top: elementRect.top - containerRect.top + container.scrollTop,
  };
}

function getTouchDistance(touches: Touches) {
  const firstTouch = touches.item(0);
  const secondTouch = touches.item(1);
  if (!firstTouch || !secondTouch) return 0;

  return Math.hypot(firstTouch.clientX - secondTouch.clientX, firstTouch.clientY - secondTouch.clientY);
}

function getTouchCenter(touches: Touches) {
  const firstTouch = touches.item(0);
  const secondTouch = touches.item(1);

  return {
    x: ((firstTouch?.clientX ?? 0) + (secondTouch?.clientX ?? 0)) / 2,
    y: ((firstTouch?.clientY ?? 0) + (secondTouch?.clientY ?? 0)) / 2,
  };
}

export const PicturePreview: FC<Props> = ({ svgRef }) => {
  const scrollElementRef = useRef<HTMLDivElement>(null);
  const previewSurfaceRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef(1);
  const zoomAnchorRef = useRef<{
    imageCenterX: number;
    imageCenterY: number;
    clientX: number;
    clientY: number;
  } | null>(null);
  const dragRef = useRef({
    active: false,
    pointerId: -1,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
  });
  const pinchRef = useRef({
    active: false,
    startDistance: 0,
    startZoom: 1,
    imageCenterX: 0,
    imageCenterY: 0,
  });
  const [dragging, setDragging] = useState(false);
  const [zoom, setZoom] = useState(1);
  const { state } = useContext(store);
  const previewWidth = state.renderParameter.width * zoom;
  const previewHeight = state.renderParameter.height * zoom;
  const zoomPercent = Math.round(zoom * 100);

  const updateZoomAtClientPoint = useCallback(
    (value: number, imageCenterX: number, imageCenterY: number, clientX: number, clientY: number) => {
      const nextZoom = normalizeZoom(value);
      const element = scrollElementRef.current;

      if (!element) {
        zoomRef.current = nextZoom;
        setZoom(nextZoom);
        return;
      }

      zoomRef.current = nextZoom;
      setZoom(nextZoom);

      zoomAnchorRef.current = { imageCenterX, imageCenterY, clientX, clientY };
    },
    [],
  );

  const updateZoom = useCallback(
    (value: number) => {
      const nextZoom = normalizeZoom(value);
      const element = scrollElementRef.current;
      const previewSurface = previewSurfaceRef.current;

      if (!element || !previewSurface) {
        zoomRef.current = nextZoom;
        setZoom(nextZoom);
        return;
      }

      const previewOffset = getScrollOffset(element, previewSurface);
      const centerX = element.scrollLeft + element.clientWidth / 2;
      const centerY = element.scrollTop + element.clientHeight / 2;
      const imageCenterX = (centerX - previewOffset.left) / zoomRef.current;
      const imageCenterY = (centerY - previewOffset.top) / zoomRef.current;
      const containerRect = element.getBoundingClientRect();

      updateZoomAtClientPoint(
        nextZoom,
        imageCenterX,
        imageCenterY,
        containerRect.left + element.clientWidth / 2,
        containerRect.top + element.clientHeight / 2,
      );
    },
    [updateZoomAtClientPoint],
  );

  const startPinch = useCallback((touches: Touches) => {
    const element = scrollElementRef.current;
    const previewSurface = previewSurfaceRef.current;
    if (!element || !previewSurface) return;

    const startDistance = getTouchDistance(touches);
    if (startDistance <= 0) return;

    const center = getTouchCenter(touches);
    const containerRect = element.getBoundingClientRect();
    const previewOffset = getScrollOffset(element, previewSurface);
    const currentZoom = zoomRef.current;

    pinchRef.current = {
      active: true,
      startDistance,
      startZoom: currentZoom,
      imageCenterX: (element.scrollLeft + center.x - containerRect.left - previewOffset.left) / currentZoom,
      imageCenterY: (element.scrollTop + center.y - containerRect.top - previewOffset.top) / currentZoom,
    };
    dragRef.current.active = false;
    setDragging(false);
  }, []);

  const handleTouchStart = useCallback(
    (event: ReactTouchEvent<HTMLDivElement>) => {
      if (event.touches.length < 2) return;

      event.preventDefault();
      startPinch(event.touches);
    },
    [startPinch],
  );

  const handleTouchMove = useCallback(
    (event: ReactTouchEvent<HTMLDivElement>) => {
      const pinch = pinchRef.current;
      if (!pinch.active || event.touches.length < 2) return;

      event.preventDefault();
      const distance = getTouchDistance(event.touches);
      if (distance <= 0) return;

      const center = getTouchCenter(event.touches);
      updateZoomAtClientPoint(
        pinch.startZoom * (distance / pinch.startDistance),
        pinch.imageCenterX,
        pinch.imageCenterY,
        center.x,
        center.y,
      );
    },
    [updateZoomAtClientPoint],
  );

  const handleTouchEnd = useCallback(
    (event: ReactTouchEvent<HTMLDivElement>) => {
      if (event.touches.length >= 2) {
        startPinch(event.touches);
        return;
      }

      pinchRef.current.active = false;
    },
    [startPinch],
  );

  useEffect(() => {
    const element = scrollElementRef.current;
    if (!element) return;

    const previewSurface = previewSurfaceRef.current;
    if (!previewSurface) return;

    const previewOffset = getScrollOffset(element, previewSurface);

    element.scrollTo({
      left: previewOffset.left + previewSurface.offsetWidth / 2 - element.clientWidth / 2,
      top: previewOffset.top + previewSurface.offsetHeight / 2 - element.clientHeight / 2,
    });
  }, [state.renderParameter.width, state.renderParameter.height]);

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  useLayoutEffect(() => {
    const zoomAnchor = zoomAnchorRef.current;
    if (!zoomAnchor) return;

    const element = scrollElementRef.current;
    const previewSurface = previewSurfaceRef.current;
    if (!element || !previewSurface) return;

    zoomAnchorRef.current = null;

    const containerRect = element.getBoundingClientRect();
    const previewOffset = getScrollOffset(element, previewSurface);
    element.scrollTo({
      left: previewOffset.left + zoomAnchor.imageCenterX * zoom - (zoomAnchor.clientX - containerRect.left),
      top: previewOffset.top + zoomAnchor.imageCenterY * zoom - (zoomAnchor.clientY - containerRect.top),
    });
  }, [zoom]);

  useEffect(() => {
    const element = scrollElementRef.current;
    if (!element) return;

    const preventBrowserPinch = (event: TouchEvent) => {
      if (event.touches.length >= 2) {
        event.preventDefault();
      }
    };

    element.addEventListener('touchmove', preventBrowserPinch, { passive: false });

    return () => {
      element.removeEventListener('touchmove', preventBrowserPinch);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div
        className={[styles.scrollArea, dragging ? styles.dragging : ''].filter(Boolean).join(' ')}
        ref={scrollElementRef}
        onPointerDown={(e) => {
          if (e.pointerType === 'touch') return;
          if (e.pointerType === 'mouse' && e.button !== 0) return;

          const element = e.currentTarget;
          dragRef.current = {
            active: true,
            pointerId: e.pointerId,
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
          if (!drag.active || drag.pointerId !== e.pointerId) return;

          const element = e.currentTarget;
          element.scrollLeft = drag.scrollLeft - (e.clientX - drag.startX);
          element.scrollTop = drag.scrollTop - (e.clientY - drag.startY);
        }}
        onPointerUp={(e) => {
          if (!dragRef.current.active || dragRef.current.pointerId !== e.pointerId) return;

          dragRef.current.active = false;
          if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
          }
          setDragging(false);
        }}
        onPointerCancel={(e) => {
          if (!dragRef.current.active || dragRef.current.pointerId !== e.pointerId) return;

          dragRef.current.active = false;
          setDragging(false);
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
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
