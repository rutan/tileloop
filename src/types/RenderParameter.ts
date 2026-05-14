import { Picture } from './Picture';

export type TileLayoutMode = 'grid' | 'staggered';

export interface RenderParameter {
  pictures: Picture[];
  width: number;
  height: number;
  itemWidth: number;
  itemHeight: number;
  rotation: number;
  margin: number;
  borderRadius: number;
  bgColor: string;
  bgOpacity: number;
  frontColor: string;
  frontOpacity: number;
  shadowColor: string;
  shadowOpacity: number;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  layoutMode: TileLayoutMode;
  arrangementSeed: string;
}
