import * as React from 'react';
import styled from '@emotion/styled';
import { useContext, useRef } from 'react';
import { setResultFile, store } from '../../store';
import { SvgRenderer } from '../atoms/SvgRenderer';
import { RenderParameter } from '../../types/RenderParameter';

const Container = styled.div``;

const DownloadButton = styled.button`
  position: fixed;
  top: 10px;
  right: 10px;
  width: 100px;
  height: 50px;
  background: #ccc;
  border-radius: 5px;
`;

export const PicturePreview = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const dummyCanvasRef = useRef<HTMLCanvasElement>(null);
  const { state, dispatch } = useContext(store);

  return (
    <Container>
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
        save
      </DownloadButton>
      <canvas
        ref={dummyCanvasRef}
        style={{
          display: 'none',
        }}
      />
      <SvgRenderer ref={svgRef} parameter={state.renderParameter} />
    </Container>
  );
};
