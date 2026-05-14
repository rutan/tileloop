import { Picture } from './Picture';

export type TileArrangementMode = 'balanced' | 'random';

export interface RenderParameter {
  pictures: Picture[];
  width: number;
  height: number;
  itemSizeX: number;
  itemSizeY: number;
  itemWidth: number;
  itemHeight: number;
  rotation: number;
  margin: number;
  borderRadius: number;
  bgColor: string;
  bgOpacity: number;
  frontColor: string;
  frontOpacity: number;
  arrangementMode: TileArrangementMode;
  arrangementSeed: string;
}
