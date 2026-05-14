import * as React from 'react';
import { createTilePlacements } from '../../functions/createTilePlacements';
import { RenderParameter } from '../../types/RenderParameter';

interface Props {
  parameter: RenderParameter;
}

export const SvgRenderer = React.forwardRef<SVGSVGElement, Props>(({ parameter }, ref) => {
  const {
    width,
    height,
    pictures,
    itemWidth,
    itemHeight,
    rotation,
    margin,
    borderRadius,
    bgColor,
    bgOpacity,
    frontColor,
    frontOpacity,
    shadowColor,
    shadowOpacity,
    shadowBlur,
    shadowOffsetX,
    shadowOffsetY,
    layoutMode,
    arrangementSeed,
  } = parameter;
  const placements = React.useMemo(
    () =>
      createTilePlacements({
        pictures,
        width,
        height,
        itemWidth,
        itemHeight,
        margin,
        layoutMode,
        arrangementSeed,
      }),
    [arrangementSeed, height, itemHeight, itemWidth, layoutMode, margin, pictures, width],
  );

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
      ref={ref}
    >
      <defs>
        <clipPath id="image-clip">
          <rect width={itemWidth} height={itemHeight} rx={borderRadius} />
        </clipPath>
        <filter id="drop-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow
            dx={shadowOffsetX}
            dy={shadowOffsetY}
            stdDeviation={shadowBlur}
            floodColor={shadowColor}
            floodOpacity={shadowOpacity}
          />
        </filter>
      </defs>
      <rect fill={bgColor} opacity={bgOpacity} x={-width / 2} y={-height / 2} width={width} height={height} />
      <g transform={`rotate(${rotation})`}>
        {placements.map((placement) => (
          <g key={placement.id} transform={`translate(${placement.x} ${placement.y})`} filter="url(#drop-shadow)">
            <image
              clipPath="url(#image-clip)"
              href={placement.picture.url}
              width={itemWidth}
              height={itemHeight}
              preserveAspectRatio="xMidYMid slice"
            />
          </g>
        ))}
      </g>
      <rect fill={frontColor} opacity={frontOpacity} x={-width / 2} y={-height / 2} width={width} height={height} />
    </svg>
  );
});
