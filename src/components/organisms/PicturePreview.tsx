import styled from '@emotion/styled';
import * as React from 'react';
import { useContext, useEffect, useRef, useState } from 'react';
import { setResultFile, store } from '../../store';
import { SvgRenderer } from '../atoms/SvgRenderer';

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const DownloadButton = styled.button`
  position: fixed;
  top: 10px;
  left: 10px;
  width: 100px;
  height: 50px;
  background: #0288d1;
  color: #fff;
  border-radius: 25px;
`;

const ScrollArea = styled.div<{ dragging: boolean }>`
  width: 100%;
  height: 100%;
  overflow: auto;
  cursor: ${({ dragging }: { dragging: boolean }) => (dragging ? 'grabbing' : 'grab')};
  user-select: none;
`;

const ScrollContainerInner = styled.div<{ width: number; height: number }>`
  width: ${({ width }: { width: number }) => `${width}px`};
  height: ${({ height }: { height: number }) => `${height}px`};
  min-width: 100vw;
  min-height: 100vh;
  padding: 100px;
  box-sizing: content-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const PicturePreview = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollElementRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const dummyCanvasRef = useRef<HTMLCanvasElement>(null);
  const dragRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
  });
  const [dragging, setDragging] = useState(false);
  const { state, dispatch } = useContext(store);

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
    <Container ref={containerRef}>
      <DownloadButton
        onClick={() => {
          const svg = svgRef.current;
          const dummyCanvas = dummyCanvasRef.current;
          if (!svg || !dummyCanvas) return;

          const img = new Image();
          img.src = `data:image/svg+xml;base64,${btoa(svg.outerHTML)}`;
          img.onload = () => {
            const ctx = dummyCanvas.getContext('2d');
            if (!ctx) throw new Error('Broken canvas context.');
            dummyCanvas.width = state.renderParameter.width;
            dummyCanvas.height = state.renderParameter.height;
            ctx.clearRect(0, 0, dummyCanvas.width, dummyCanvas.height);
            ctx.drawImage(img, 0, 0, dummyCanvas.width, dummyCanvas.height);

            dummyCanvas.toBlob(
              (blob) => {
                if (!blob) return;

                const url = URL.createObjectURL(blob);
                dispatch(setResultFile(url));
              },
              'image/png',
              1,
            );
          };
          img.onerror = (e) => {
            console.error(e);
          };
        }}
      >
        完成！
      </DownloadButton>
      <canvas
        ref={dummyCanvasRef}
        style={{
          display: 'none',
        }}
      />

      <ScrollArea
        ref={scrollElementRef}
        dragging={dragging}
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
      >
        <ScrollContainerInner width={state.renderParameter.width} height={state.renderParameter.height} ref={innerRef}>
          <SvgRenderer ref={svgRef} parameter={state.renderParameter} />
        </ScrollContainerInner>
      </ScrollArea>
    </Container>
  );
};
