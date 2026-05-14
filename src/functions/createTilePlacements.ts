import { Picture } from '../types/Picture';
import { RenderParameter } from '../types/RenderParameter';

export interface TilePlacement {
  id: string;
  picture: Picture;
  x: number;
  y: number;
}

type TilePlacementParameter = Pick<
  RenderParameter,
  'pictures' | 'width' | 'height' | 'itemWidth' | 'itemHeight' | 'margin' | 'layoutMode' | 'arrangementSeed'
>;

function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createRandom(seed: string) {
  let state = hashString(seed) || 1;

  return () => {
    state = Math.imul(state ^ (state >>> 15), 1 | state);
    state ^= state + Math.imul(state ^ (state >>> 7), 61 | state);
    return ((state ^ (state >>> 14)) >>> 0) / 4294967296;
  };
}

function pickBalancedPictureIndex(
  grid: number[],
  usageCounts: number[],
  x: number,
  y: number,
  columns: number,
  pictureCount: number,
  random: () => number,
): number {
  let bestScore = Number.POSITIVE_INFINITY;
  let bestIndexes: number[] = [];

  for (let index = 0; index < pictureCount; index += 1) {
    let score = usageCounts[index] * 10 + random();
    const left = x > 0 ? grid[y * columns + x - 1] : undefined;
    const above = y > 0 ? grid[(y - 1) * columns + x] : undefined;
    const aboveLeft = x > 0 && y > 0 ? grid[(y - 1) * columns + x - 1] : undefined;
    const aboveRight = x < columns - 1 && y > 0 ? grid[(y - 1) * columns + x + 1] : undefined;

    if (left === index) score += 1000;
    if (above === index) score += 1000;
    if (aboveLeft === index) score += 120;
    if (aboveRight === index) score += 120;

    if (score < bestScore) {
      bestScore = score;
      bestIndexes = [index];
    } else if (score === bestScore) {
      bestIndexes.push(index);
    }
  }

  return bestIndexes[Math.floor(random() * bestIndexes.length)] ?? 0;
}

export function createTilePlacements(parameter: TilePlacementParameter): TilePlacement[] {
  const { pictures, width, height, itemWidth, itemHeight, margin, layoutMode, arrangementSeed } = parameter;

  if (pictures.length === 0) return [];

  const tileStepX = Math.max(1, itemWidth + margin);
  const tileStepY = Math.max(1, itemHeight + margin);
  const coverSize = Math.hypot(width, height);
  const columns = Math.max(1, Math.ceil(coverSize / tileStepX) + 2);
  const rows = Math.max(1, Math.ceil(coverSize / tileStepY) + (layoutMode === 'staggered' ? 3 : 2));
  const random = createRandom(
    `${arrangementSeed}:${layoutMode}:${columns}:${rows}:${pictures.map((picture) => picture.id).join(',')}`,
  );
  const usageCounts = Array.from({ length: pictures.length }, () => 0);
  const grid: number[] = [];

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < columns; x += 1) {
      const pictureIndex = pickBalancedPictureIndex(grid, usageCounts, x, y, columns, pictures.length, random);

      usageCounts[pictureIndex] += 1;
      grid[y * columns + x] = pictureIndex;
    }
  }

  return grid.map((pictureIndex, index) => {
    const x = index % columns;
    const y = Math.floor(index / columns);
    const staggerOffset = layoutMode === 'staggered' && x % 2 === 1 ? tileStepY / 2 : 0;

    return {
      id: `tile-${x}-${y}-${pictures[pictureIndex].id}`,
      picture: pictures[pictureIndex],
      x: (x - columns / 2) * tileStepX,
      y: (y - rows / 2) * tileStepY + staggerOffset,
    };
  });
}
