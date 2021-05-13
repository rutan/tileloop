import * as React from 'react';
import { ClassNames, css } from '@emotion/react';
import styled from '@emotion/styled';
import { useContext, useEffect, useRef } from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';
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

const ScrollContainerStyle = css`
  width: 100%;
  height: 100%;
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
  const scrollContainerRef = useRef<ScrollContainer>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const dummyCanvasRef = useRef<HTMLCanvasElement>(null);
  const { state, dispatch } = useContext(store);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;
    const element = scrollContainer.getElement();

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
            if (!ctx) throw 'broken canvas context';
            dummyCanvas.width = state.renderParameter.width;
            dummyCanvas.height = state.renderParameter.height;
            ctx.clearRect(0, 0, dummyCanvas.width, dummyCanvas.height);
            ctx.drawImage(img, 0, 0, dummyCanvas.width, dummyCanvas.height);

            dummyCanvas.toBlob(
              (blob) => {
                const url = URL.createObjectURL(blob);
                dispatch(setResultFile(url));
              },
              'image/png',
              1
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

      <ClassNames>
        {({ css }) => (
          <ScrollContainer
            className={css`
              ${ScrollContainerStyle}
            `}
            ref={scrollContainerRef}
          >
            <ScrollContainerInner
              width={state.renderParameter.width}
              height={state.renderParameter.height}
              ref={innerRef}
            >
              <SvgRenderer ref={svgRef} parameter={state.renderParameter} />
            </ScrollContainerInner>
          </ScrollContainer>
        )}
      </ClassNames>
    </Container>
  );
};
