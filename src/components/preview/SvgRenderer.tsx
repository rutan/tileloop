import { forwardRef, useId, useMemo } from 'react';
import { createTilePlacements } from '../../functions/createTilePlacements';
import { RenderParameter } from '../../types/RenderParameter';

interface Props {
  parameter: RenderParameter;
}

export const SvgRenderer = forwardRef<SVGSVGElement, Props>(({ parameter }, ref) => {
  const idPrefix = useId().replace(/:/g, '');
  const clipPathId = `${idPrefix}-image-clip`;
  const dropShadowId = `${idPrefix}-drop-shadow`;
  const {
    width,
    height,
    pictures,
    itemWidth,
    itemHeight,
    rotation,
    margin,
    borderRadius,
    tileOpacity,
    bgColor,
    bgOpacity,
    shadowColor,
    shadowOpacity,
    shadowBlur,
    shadowOffsetX,
    shadowOffsetY,
    layoutMode,
    arrangementSeed,
  } = parameter;
  const placements = useMemo(
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
        <clipPath id={clipPathId}>
          <rect width={itemWidth} height={itemHeight} rx={borderRadius} />
        </clipPath>
        <filter id={dropShadowId} x="-50%" y="-50%" width="200%" height="200%">
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
          <g key={placement.id} transform={`translate(${placement.x} ${placement.y})`} filter={`url(#${dropShadowId})`}>
            <image
              clipPath={`url(#${clipPathId})`}
              href={placement.picture.url}
              width={itemWidth}
              height={itemHeight}
              opacity={tileOpacity}
              preserveAspectRatio="xMidYMid slice"
            />
          </g>
        ))}
      </g>
    </svg>
  );
});
