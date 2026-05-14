import * as React from 'react';
import { useContext, useEffect, useRef, useState } from 'react';
import { store } from '../../store';
import { SvgRenderer } from '../atoms/SvgRenderer';
import styles from './PicturePreview.module.css';

interface Props {
  svgRef: React.RefObject<SVGSVGElement>;
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
  const { state } = useContext(store);

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
      >
        <div
          className={styles.scrollContainerInner}
          style={{
            width: `${state.renderParameter.width}px`,
            height: `${state.renderParameter.height}px`,
          }}
          ref={innerRef}
        >
          <SvgRenderer ref={svgRef} parameter={state.renderParameter} />
        </div>
      </div>
    </div>
  );
};
