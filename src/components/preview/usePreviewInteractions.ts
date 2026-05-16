import {
  PointerEvent as ReactPointerEvent,
  TouchEvent as ReactTouchEvent,
  WheelEvent as ReactWheelEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

export const MIN_ZOOM = 0.1;
export const MAX_ZOOM = 4;
export const ZOOM_STEP = 0.1;

interface Touches {
  item(index: number): { clientX: number; clientY: number } | null;
}

interface UsePreviewInteractionsParameter {
  width: number;
  height: number;
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

export function usePreviewInteractions({ width, height }: UsePreviewInteractionsParameter) {
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
  const previewWidth = width * zoom;
  const previewHeight = height * zoom;
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

  const handlePointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    const element = event.currentTarget;
    dragRef.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop,
    };
    element.setPointerCapture(event.pointerId);
    setDragging(true);
  }, []);

  const handlePointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag.active || drag.pointerId !== event.pointerId) return;

    const element = event.currentTarget;
    element.scrollLeft = drag.scrollLeft - (event.clientX - drag.startX);
    element.scrollTop = drag.scrollTop - (event.clientY - drag.startY);
  }, []);

  const handlePointerUp = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active || dragRef.current.pointerId !== event.pointerId) return;

    dragRef.current.active = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDragging(false);
  }, []);

  const handlePointerCancel = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active || dragRef.current.pointerId !== event.pointerId) return;

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

  const handleWheel = useCallback(
    (event: ReactWheelEvent<HTMLDivElement>) => {
      if (!event.ctrlKey) return;

      event.preventDefault();
      updateZoom(zoom + (event.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP));
    },
    [updateZoom, zoom],
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
  }, [width, height]);

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

  return {
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
  };
}
