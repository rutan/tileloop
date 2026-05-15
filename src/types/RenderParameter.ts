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
  tileOpacity: number;
  bgColor: string;
  bgOpacity: number;
  shadowColor: string;
  shadowOpacity: number;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  layoutMode: TileLayoutMode;
  arrangementSeed: string;
}
