import * as React from 'react';
import { RenderParameter } from '../../types/RenderParameter';

interface Props {
  parameter: RenderParameter;
}

export const SvgRenderer = React.forwardRef(({ parameter }: Props, ref) => {
  const {
    pictures,
    width,
    height,
    itemSizeX,
    itemSizeY,
    itemWidth,
    itemHeight,
    rotation,
    margin,
    borderRadius,
    bgColor,
    bgOpacity,
    frontColor,
    frontOpacity,
  } = parameter;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
      ref={ref as any}
    >
      <defs>
        <clipPath id="image-clip">
          <rect width={itemWidth} height={itemHeight} rx={borderRadius} />
        </clipPath>
        <filter id="drop-shadow">
          <feComponentTransfer in="SourceAlpha">
            <feFuncR type="discrete" tableValues="0.2" />
            <feFuncG type="discrete" tableValues="0.2" />
            <feFuncB type="discrete" tableValues="0.2" />
          </feComponentTransfer>
          <feGaussianBlur stdDeviation="1" />
          <feOffset dx="1" dy="1" result="shadow" />
          <feComposite in="SourceGraphic" in2="shadow" operator="over" />
        </filter>
      </defs>
      <rect fill={bgColor} opacity={bgOpacity} x={-width / 2} y={-height / 2} width={width} height={height} />
      <g transform={`rotate(${rotation})`}>
        {new Array(itemSizeY).fill(null).map((_, j) => {
          return (
            <React.Fragment key={`item-${j}`}>
              {new Array(itemSizeX).fill(null).map((_, i) => {
                if (pictures.length === 0) return null;

                const picture = pictures[(i + j * itemSizeX) % pictures.length];
                return (
                  <g
                    key={`item-${i}_${j}`}
                    transform={`translate(${(i - itemSizeX / 2) * (itemWidth + margin)} ${
                      (j - itemSizeY / 2) * (itemHeight + margin)
                    })`}
                    filter="url(#drop-shadow)"
                  >
                    <image
                      clipPath="url(#image-clip)"
                      href={picture.url}
                      width={itemWidth}
                      height={itemHeight}
                      preserveAspectRatio="xMidYMid slice"
                    />
                  </g>
                );
              })}
            </React.Fragment>
          );
        })}
      </g>
      <rect fill={frontColor} opacity={frontOpacity} x={-width / 2} y={-height / 2} width={width} height={height} />
    </svg>
  );
});
